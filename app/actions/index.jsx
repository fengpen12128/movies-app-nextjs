"use server";

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import dayjs from "dayjs";

export async function getDownloadMovies(page = 1, collected) {
  try {
    const pageSize = 50;
    const skip = (page - 1) * pageSize;

    const collectionMovies = await prisma.moviesCollection.findMany({
      select: {
        movieCode: true,
      },
    });
    const collectionMovieCode = collectionMovies.map((x) => x.movieCode);

    let q = {
      where: {
        ...(collected === "true" && {
          movieCode: {
            in: collectionMovieCode,
          },
        }),
        ...(collected === "false" && {
          movieCode: {
            notIn: collectionMovieCode,
          },
        }),
      },
      include: {
        MovieInfo: {
          include: {
            files: {
              where: {
                type: 2,
              },
            },
          },
        },
      },
      orderBy: {
        createdTime: "desc",
      },
      skip,
      distinct: ["movieCode"], // Add this line to ensure unique movieCode entries

      take: pageSize,
    };

    let [downloadMoviesResult, totalCount] = await Promise.all([
      prisma.moviesVideoResource.findMany(q),
      prisma.moviesVideoResource.count({ where: q.where }),
    ]);

    const downloadMovies = downloadMoviesResult.map((x) => ({
      downloadTime: x.createdTime,
      ...x.MovieInfo,
    }));

    downloadMovies.forEach((x) => {
      try {
        x.releaseDate = dayjs(x.releaseDate || "2000-01-01").format(
          "YYYY-MM-DD"
        );
        x.collected = collectionMovieCode.includes(x.code);
        x.downloaded = true;
        x.coverUrl = x.files[0]?.path;
        delete x.files;
      } catch (error) {
        console.log(error);
      }
    });

    return {
      pagination: {
        totalCount,
        current: page,
        pageSize,
        totalPage: Math.ceil(totalCount / pageSize),
      },
      movies: downloadMovies,
    };
  } catch (error) {
    console.log(error);
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
