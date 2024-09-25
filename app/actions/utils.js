import prisma from "@/app/lib/prisma";
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
    rate: String(movie.rate),
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

export const groupByActress = (arr, key) => {
  return arr.reduce((result, item) => {
    item[key].forEach((category) => {
      if (!result[category]) {
        result[category] = [];
      }
      result[category].push(item);
    });
    return result;
  }, {});
};

export const createStack = (collectionMovies) => {
  // 提取actresses数量大于2 的不参与stack
  let multiActresses = collectionMovies
    .filter((x) => x.actresses.length > 2)
    .map((x) => ({
      actress: "",
      movies: [x],
    }));

  collectionMovies = collectionMovies.filter((x) => x.actresses.length <= 2);

  const groupedData = groupByActress(collectionMovies, "actresses");

  // stack 中的movies 收藏时间排序
  let p = Object.keys(groupedData).map((x) => ({
    actress: x,
    movies:
      groupedData[x].length > 1
        ? groupedData[x].sort(
            (a, b) => new Date(b.collectedTime) - new Date(a.collectedTime)
          )
        : groupedData[x],
  }));

  // 将 单个movies 也转化成数组形式
  let single = p
    .filter((x) => x.movies.length === 1)
    .map((x) => x.movies[0])
    .filter(
      (movie, index, self) =>
        index === self.findIndex((t) => t.code === movie.code)
    )
    .map((x) => ({
      actress: "",
      movies: [x],
    }));

  // 合并
  let result = [
    ...single,
    ...p.filter((x) => x.movies.length > 1),
    ...multiActresses,
  ].sort(
    (a, b) =>
      new Date(b.movies[0].collectedTime) - new Date(a.movies[0].collectedTime)
  );

  return result;
};
