import prisma from "@/utils/prisma";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const pageSize = 50;

    const skip = (page - 1) * pageSize;

    let q = {
      where: {},
      include: {
        MovieInfo: {
          include: {
            files: true,
          },
        },
      },
      skip,
      take: pageSize,
    };

    let [collectionMovies, downloadMoviesResult, totalCount] =
      await Promise.all([
        prisma.MoviesCollection.findMany({
          select: {
            moviesCode: true,
          },
        }),
        prisma.MoviesVideoResource.findMany(q),
        prisma.MoviesVideoResource.count({ where: q.where }),
      ]);

    const collectionMoviesCode = collectionMovies.map((x) => x.moviesCode);

    const downloadMovies = downloadMoviesResult.map((x) => ({
      downloadTime: x.createdTime,
      ...x.MovieInfo,
    }));

    downloadMovies.forEach((x) => {
      x.releaseDate = x.releaseDate.toLocaleDateString();
      x.collected = collectionMoviesCode.includes(x.code);
      x.downloaded = true;
      x.coverUrl = x.files[0]?.path;
      delete x.files;
    });

    return Response.json(
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
    return Response.json(
      { error: "Failed to load downloaded movies" },
      { status: 500 }
    );
  }
};
