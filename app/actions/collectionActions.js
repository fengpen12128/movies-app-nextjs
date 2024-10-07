"use server";

import prisma from "@/app/lib/prisma";
import {
  DEFAULT_PAGE_SIZE,
  getCollectionAndDownloadStatus,
  formatMovie,
  getPaginationData,
  createStack,
} from "./utils";
import { collectionMovieQuery } from "./queryObjects";
import { revalidatePath } from "next/cache";

export async function getCollectionMovies({
  page = 1,
  download,
  isStack = false,
}) {
  const skip = (page - 1) * DEFAULT_PAGE_SIZE;

  try {
    const { downloadMovieCode } = await getCollectionAndDownloadStatus();

    let q = {
      ...collectionMovieQuery,
      where: {
        ...(download === "true" && {
          movieCode: { in: Array.from(downloadMovieCode) },
        }),
        ...(download === "false" && {
          movieCode: { notIn: Array.from(downloadMovieCode) },
        }),
      },
      skip,
      take: DEFAULT_PAGE_SIZE,
    };

    let [collectionMovies, totalCount] = await Promise.all([
      prisma.moviesCollection.findMany(q),
      prisma.moviesCollection.count({ where: q.where }),
    ]);

    collectionMovies = collectionMovies
      .filter((x) => x.MovieInfo)
      .map((x) => ({
        collectedTime: x.createdTime,
        ...formatMovie(x.MovieInfo, {
          collectedMovieCode: new Set([x.movieCode]),
          downloadMovieCode,
        }),
        actresses: x.MovieInfo.actresses.map((actress) => actress.actressName),
      }));

    if (isStack) {
      return {
        movies: createStack(collectionMovies),
      };
    }

    return {
      pagination: getPaginationData(totalCount, page, DEFAULT_PAGE_SIZE),
      movies: collectionMovies,
    };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
}

export async function toggleCollection(code, refreshPath) {
  try {
    // Check if the movie is already collected
    const existingCollection = await prisma.moviesCollection.findUnique({
      where: {
        movieCode: code,
      },
    });

    if (existingCollection) {
      await prisma.moviesCollection.delete({
        where: {
          movieCode: code,
        },
      });
      revalidatePath(refreshPath);
      return [true, "取消收藏成功"];
    }

    // If not collected, add to collection
    await prisma.moviesCollection.create({
      data: {
        movieCode: code,
      },
    });
    revalidatePath(refreshPath);
    return [true, "收藏成功"];
  } catch (error) {
    console.error("Error collecting movie:", error);
    return [false, "操作失败，请重试"];
  }
}
