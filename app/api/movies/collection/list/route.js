import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";
import { DEFAULT_PAGE_SIZE, getCollectionAndDownloadStatus, formatMovie, getPaginationData } from "../../utils";

export const GET = async (req) => {
  const { searchParams } = new URL(req.nextUrl);
  const page = Number(searchParams.get("page") || 1);
  const download = searchParams.get("download");
  const pageSize = DEFAULT_PAGE_SIZE;

  const skip = (page - 1) * pageSize;

  try {
    const { downloadMovieCode } = await getCollectionAndDownloadStatus();

    let q = {
      where: {
        ...(download === "true" && { movieCode: { in: Array.from(downloadMovieCode) } }),
        ...(download === "false" && { movieCode: { notIn: Array.from(downloadMovieCode) } }),
      },
      include: {
        MovieInfo: {
          include: {
            files: { where: { type: 2 } },
            actresses: true,
          },
        },
      },
      skip,
      take: pageSize,
      orderBy: { createdTime: "desc" },
    };

    let [collectionMovies, totalCount] = await Promise.all([
      prisma.MoviesCollection.findMany(q),
      prisma.MoviesCollection.count({ where: q.where }),
    ]);

    collectionMovies = collectionMovies
      .filter(x => x.MovieInfo)
      .map(x => ({
        collectedTime: x.createdTime,
        ...formatMovie(x.MovieInfo, { collectedMovieCode: new Set([x.movieCode]), downloadMovieCode }),
        actresses: x.MovieInfo.actresses.map(actress => actress.actressName),
      }));

    return NextResponse.json({
      pagination: getPaginationData(totalCount, page, pageSize),
      data: collectionMovies,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
