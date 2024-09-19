import prisma from "@/utils/prisma";
import {
  DEFAULT_PAGE_SIZE,
  getCollectionAndDownloadStatus,
  formatMovie,
  getPaginationData,
} from "./utils";

export const POST = async (request) => {
  const {
    search,
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
    prefix,
    actressName,
  } = await request.json();
  console.log("page", page);

  try {
    const skip = (page - 1) * limit;
    let moviesQuery = {
      skip,
      take: limit,
      orderBy: { releaseDate: "desc" },
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
              actressName: { contains: actressName, mode: "insensitive" },
            },
          },
        }),
      },
      include: {
        tags: true,
        files: { where: { type: 2 } },
      },
    };

    const [movies, totalCount] = await Promise.all([
      prisma.moviesInfo.findMany(moviesQuery),
      prisma.moviesInfo.count({ where: moviesQuery.where }),
    ]);

    const { collectedMovieCode, downloadMovieCode } =
      await getCollectionAndDownloadStatus();

    const formattedMovies = movies.map((movie) =>
      formatMovie(movie, { collectedMovieCode, downloadMovieCode })
    );

    return Response.json(
      {
        movies: formattedMovies,
        pagination: getPaginationData(totalCount, page, limit),
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
