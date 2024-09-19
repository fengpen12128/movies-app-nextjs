"use server";

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import dayjs from "dayjs";

const getCollectionAndDownloadStatus = async () => {
  const [downloadMovies, collectedMovies] = await Promise.all([
    prisma.MoviesVideoResource.findMany({ select: { movieCode: true } }),
    prisma.MoviesCollection.findMany({ select: { movieCode: true } }),
  ]);

  const collectedMovieCode = new Set(
    collectedMovies.map((item) => item.movieCode)
  );
  const downloadMovieCode = new Set(
    downloadMovies.map((item) => item.movieCode)
  );

  return { collectedMovieCode, downloadMovieCode };
};

const formatMovie = (movie, { collectedMovieCode, downloadMovieCode }) => {
  const formattedMovie = {
    ...movie,
    coverUrl: movie.files?.find((file) => file.type === 2)?.path || "",
    releaseDate: dayjs(movie.releaseDate).format("YYYY-MM-DD"),
    collected: collectedMovieCode.has(movie.code),
    downloaded: downloadMovieCode.has(movie.code),
    rate: String(movie.rate),
  };
  delete formattedMovie.files;
  return formattedMovie;
};

const getPaginationData = (totalCount, page, limit) => ({
  totalCount,
  current: page,
  pageSize: limit,
  totalPage: Math.ceil(totalCount / limit),
});

export async function getMovies({
  page = 1,
  searchKeyword,
  prefix,
  actressName,
}) {
  const DEFAULT_PAGE_SIZE = 50;
  try {
    const skip = (page - 1) * DEFAULT_PAGE_SIZE;
    let moviesQuery = {
      skip,
      take: DEFAULT_PAGE_SIZE,
      orderBy: { releaseDate: "desc" },
      where: {
        ...(searchKeyword && {
          OR: [
            { code: { contains: searchKeyword, mode: "insensitive" } },
            {
              actresses: {
                some: {
                  actressName: { contains: searchKeyword, mode: "insensitive" },
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

    return {
      movies: formattedMovies,
      pagination: getPaginationData(totalCount, page, DEFAULT_PAGE_SIZE),
    };
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

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
