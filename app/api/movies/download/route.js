import prisma from "@/utils/prisma";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const pageSize = 50;
    const collected = searchParams.get("collected");
    const skip = (page - 1) * pageSize;

    const collectionMovies = await prisma.MoviesCollection.findMany({
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
      take: pageSize,
    };

    let [downloadMoviesResult, totalCount] = await Promise.all([
      prisma.MoviesVideoResource.findMany(q),
      prisma.MoviesVideoResource.count({ where: q.where }),
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

    return NextResponse.json(
      {
        pagination: {
          totalCount,
          currentPage: page,
          pageSize,
          totalPages: Math.ceil(totalCount / pageSize),
        },
        movies: downloadMovies,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
