import prisma from "@/utils/prisma";


export const POST = async (request) => {
  const {
    search,
    page = 1,
    limit = 50,
    prefix,
    actressName,
  } = await request.json();

  try {
    const skip = (page - 1) * limit;
    let moviesQuery = {
      skip,
      take: limit,
      orderBy: {
        releaseDate: "desc",
      },
      where: {
        ...(search && {
          OR: [
            { code: { contains: search, mode: "insensitive" } },
            {
              actresses: {
                some: {
                  actressName: { contains: search, mode: "insensitive" },
                },
              },
            },
          ],
        }),
        ...(prefix && { prefix }),
        ...(actressName && {
          actresses: {
            some: {
              actressName: {
                contains: actressName,
                mode: "insensitive",
              },
            },
          },
        }),
        // ...(collected === 1 && {
        //   code: {
        //     in: collectedMovieCodes.map((item) => item.movieCode),
        //   },
        // }),
        // ...(downloaded === true && {
        //   code: {
        //     in: downloadedMovieCodes.map((item) => item.movieCode),
        //   },
        // }),
      },
      include: {
        tags: true,
        files: {
          where: {
            type: 2,
          },
        },
      },
    };

    const [movies, totalCount] = await Promise.all([
      prisma.moviesInfo.findMany(moviesQuery),
      prisma.moviesInfo.count({ where: moviesQuery.where }),
    ]);

    const [downloadMovies, collectedMovies] = await Promise.all([
      prisma.MoviesVideoResource.findMany({
        select: {
          movieCode: true,
        },
      }),
      prisma.MoviesCollection.findMany({
        select: {
          movieCode: true,
        },
      }),
    ]);

    const collectedMovieCode = collectedMovies.map((item) => item.movieCode);
    const downloadMovieCode = downloadMovies.map((item) => item.movieCode);

    movies.forEach((movie) => {
      movie.coverUrl = movie.files.find((file) => file.type === 2)?.path;
      delete movie.files;
      movie.releaseDate = movie.releaseDate.toLocaleDateString();
      movie.collected = collectedMovieCode.includes(movie.code);
      movie.downloaded = downloadMovieCode.includes(movie.code);
    });

    return Response.json(
      {
        movies,
        pagination: {
          totalCount,
          currentPage: page,
          pageSize: limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching movies:", error);
    return Response.json(
      { error: `Failed to load movies: ${error.message}` },
      { status: 500 }
    );
  }
};
