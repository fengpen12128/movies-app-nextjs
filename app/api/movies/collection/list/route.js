import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const download = searchParams.get("download");
  const pageSize = 50;

  const skip = (page - 1) * pageSize;

  try {
    const downloadMovies = await prisma.MoviesVideoResource.findMany({
      select: {
        movieCode: true,
      },
    });

    const downloadMovieCodes = downloadMovies.map((item) => item.movieCode);

    let q = {
      where: {
        ...(download === "true" && {
          movieCode: {
            in: downloadMovieCodes,
          },
        }),
        ...(download === "false" && {
          movieCode: {
            notIn: downloadMovieCodes,
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

    console.log("download", download);
    console.log(JSON.stringify(q));

    let collectionMovies = await prisma.MoviesCollection.findMany(q);
    let totalCount = await prisma.MoviesCollection.count({ where: q.where });

    collectionMovies = collectionMovies.filter((x) => x.MovieInfo);
    collectionMovies = collectionMovies.map((x) => ({
      collectedTime: x.createdTime,
      ...x.MovieInfo,
    }));

    collectionMovies.forEach((x) => {
      try {
        x.actresses = x.actresses.map((actress) => actress.actressName);
        x.releaseDate = x.releaseDate.toLocaleDateString();
        x.collected = true;
        x.downloaded = downloadMovieCodes.includes(x.code);
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
    console.log(error);
    return NextResponse.json({ error: ` ${error.message}` }, { status: 500 });
  }
};
