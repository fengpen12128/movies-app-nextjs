import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const pageSize = 50;

  const skip = (page - 1) * pageSize;

  try {
    const downloadMovies = await prisma.MoviesVideoResource.findMany({
      select: {
        movieCode: true,
      },
    });

    let q = {
      where: {},
      include: {
        MovieInfo: {
          include: {
            files: {
              where: {
                type: 2,
              },
            },
            actresses: true,
          },
        },
      },
      skip,
      take: pageSize,
      orderBy: {
        createdTime: "desc",
      },
    };

    let collectionMovies = await prisma.MoviesCollection.findMany(q);
    let totalCount = await prisma.MoviesCollection.count({ where: q.where });

    collectionMovies = collectionMovies.filter((x) => x.MovieInfo);
    collectionMovies = collectionMovies.map((x) => ({
      collectedTime: x.createdTime,
      ...x.MovieInfo,
    }));

    const downloadMovieCode = downloadMovies.map((item) => item.movieCode);

    collectionMovies.forEach((x) => {
      try {
        x.actresses = x.actresses.map((actress) => actress.actressName);
        x.releaseDate = x.releaseDate.toLocaleDateString();
        x.collected = true;
        x.downloaded = downloadMovieCode.includes(x.code);
        x.coverUrl = x.files[0]?.path;
        delete x.files;
      } catch (e) {
        console.error(e);
      }
    });

    return NextResponse.json({
      pagination: {
        totalCount,
        currentPage: page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
      data: collectionMovies,
    });
  } catch (error) {
    return NextResponse.json({ error: ` ${error.message}` }, { status: 500 });
  }
};
