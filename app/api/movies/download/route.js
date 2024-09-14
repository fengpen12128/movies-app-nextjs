import prisma from "@/utils/prisma";
import dayjs from 'dayjs';
import {NextResponse} from 'next/server';


export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const pageSize = 50;

    const skip = (page - 1) * pageSize;

    let q = {
      where: {},
      include: {
        MovieInfo:  {
          include: {
            files: {
              where: {
                type: 2,
              },
            },
          },
        }
      },
      orderBy: {
        createdTime: "desc",
      },
      skip,
      take: pageSize,
    };

    let [collectionMovies, downloadMoviesResult, totalCount] =
      await Promise.all([
        prisma.MoviesCollection.findMany({
          select: {
            movieCode: true,
          },
        }),
        prisma.MoviesVideoResource.findMany(q),
        prisma.MoviesVideoResource.count({ where: q.where }),
      ]);

    const collectionMovieCode = collectionMovies.map((x) => x.movieCode);

    const downloadMovies = downloadMoviesResult.map((x) => ({
      downloadTime: x.createdTime,
      ...x.MovieInfo,
    }));

    downloadMovies.forEach((x) => {
     try {
       x.releaseDate =  dayjs(x.downloadTime || '2000-01-01', 'YYYY-MM-DD')
       x.collected = collectionMovieCode.includes(x.code);
       x.downloaded = true;
       x.coverUrl = x.files[0]?.path;
       delete x.files;
     } catch (error) {
       console.log(error);
     }
    });

    return NextResponse.json({
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
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
};
