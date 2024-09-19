import prisma from "@/utils/prisma";
import dayjs from "dayjs";

export const DEFAULT_PAGE_SIZE = 50;

export const getCollectionAndDownloadStatus = async () => {
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

export const formatMovie = (
  movie,
  { collectedMovieCode, downloadMovieCode }
) => {
  const formattedMovie = {
    ...movie,
    coverUrl: movie.files?.find((file) => file.type === 2)?.path || "",
    releaseDate: dayjs(movie.releaseDate).format("YYYY-MM-DD"),
    collected: collectedMovieCode.has(movie.code),
    downloaded: downloadMovieCode.has(movie.code),
  };
  delete formattedMovie.files;
  return formattedMovie;
};

export const getPaginationData = (totalCount, page, limit) => ({
  totalCount,
  current: page,
  pageSize: limit,
  totalPage: Math.ceil(totalCount / limit),
});
