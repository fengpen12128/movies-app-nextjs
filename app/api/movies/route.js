import prisma from "@/app/lib/prisma";

export const POST = async (request) => {
  const {
    keyword,
    page,
    limit = 20,
    query = { collected: 0, downloaded: 0, actressName: "", prefix: "" },
  } = await request.json();
  const { collected, downloaded, actressName, prefix } = query;

  try {
    const collectedMoviesCodes = await prisma.moviesCollection.findMany({
      distinct: ["moviesCode"],
      select: {
        moviesCode: true,
      },
    });

    const downloadedMoviesCodes = await prisma.moviesVideoResource.findMany({
      distinct: ["movieCode"],
      select: {
        movieCode: true,
      },
    });

    const skip = (page - 1) * limit;
    let moviesQuery = {
      skip,
      take: limit,
      orderBy: {
        releaseDate: "desc",
      },
      where: {
        ...(keyword && { code: { contains: keyword, mode: "insensitive" } }),
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
        ...(collected === 1 && {
          code: {
            in: collectedMoviesCodes.map((item) => item.moviesCode),
          },
        }),
        ...(downloaded === 1 && {
          code: {
            in: downloadedMoviesCodes.map((item) => item.movieCode),
          },
        }),
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
      prisma.movieInfo.findMany(moviesQuery),
      prisma.movieInfo.count({ where: moviesQuery.where }),
    ]);

    const [downloadMovies, collectedMovies] = await Promise.all([
      prisma.MoviesVideoResource.findMany({
        select: {
          movieCode: true,
        },
      }),
      prisma.MoviesCollection.findMany({
        select: {
          moviesCode: true,
        },
      }),
    ]);

    const collectedMoviesCode = collectedMovies.map((item) => item.moviesCode);
    const downloadMoviesCode = downloadMovies.map((item) => item.movieCode);

    movies.forEach((movie) => {
      movie.coverUrl = movie.files.find((file) => file.type === 2)?.path;
      delete movie.files;
      movie.releaseDate = movie.releaseDate.toLocaleDateString();
      movie.collected = collectedMoviesCode.includes(movie.code);
      movie.downloaded = downloadMoviesCode.includes(movie.code);
    });

    const totalPages = Math.ceil(totalCount / limit);

    return new Response(
      JSON.stringify({
        movies,
        total: totalPages,
        count: totalCount,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching movies:", error);
    return new Response(`Failed to load movies: ${error.message}`, {
      status: 500,
    });
  }
};
