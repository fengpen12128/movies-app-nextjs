"use server";

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import dayjs from "dayjs";

const DEFAULT_PAGE_SIZE = 50;

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

// 根据 category 数组的每个元素进行分组
const groupByActress = (arr, key) => {
  return arr.reduce((result, item) => {
    // 遍历 category 数组的每个值

    item[key].forEach((category) => {
      // 如果 result 中还没有该 category 的分组，则初始化为一个空数组
      if (!result[category]) {
        result[category] = [];
      }

      // 将当前对象放入对应的分组
      result[category].push(item);
    });

    return result;
  }, {});
};

const createStack = (collectionMovies) => {
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

export async function getMoviesByActress({ page = 1, name }) {
  const skip = (page - 1) * DEFAULT_PAGE_SIZE;

  let q = {
    where: {
      actresses: {
        some: {
          actressName: {
            in: [name],
          },
        },
      },
    },
    select: {
      id: true,
      code: true,
      releaseDate: true,
      rate: true,
      rateNum: true,
      files: {
        where: {
          type: 2,
        },
        select: {
          path: true,
        },
      },
    },
    skip,
    take: DEFAULT_PAGE_SIZE,
    orderBy: {
      releaseDate: "desc",
    },
  };
  try {
    const [actressRel, totalCount] = await Promise.all([
      prisma.moviesInfo.findMany(q),
      prisma.moviesInfo.count({ where: q.where }),
    ]);

    const formattedActressRel = actressRel.map((movie) => ({
      id: movie.id,
      code: movie.code,
      releaseDate: dayjs(movie.releaseDate).format("YYYY-MM-DD"),
      rate: String(movie.rate),
      rateNum: movie.rateNum,
      coverUrl: movie.files[0]?.path || "",
    }));

    return {
      pagination: {
        totalCount,
        current: page,
        pageSize: DEFAULT_PAGE_SIZE,
        totalPage: Math.ceil(totalCount / DEFAULT_PAGE_SIZE),
      },
      movies: formattedActressRel,
    };
  } catch (error) {
    console.error("Error fetching actress related movies:", error);
    return { error: error.message };
  }
}

export async function getCollectionMovies({
  page = 1,
  download,
  isStack = false,
}) {
  const skip = (page - 1) * DEFAULT_PAGE_SIZE;

  try {
    const { downloadMovieCode } = await getCollectionAndDownloadStatus();

    let q = {
      where: {
        ...(download === "true" && {
          movieCode: { in: Array.from(downloadMovieCode) },
        }),
        ...(download === "false" && {
          movieCode: { notIn: Array.from(downloadMovieCode) },
        }),
      },
      include: {
        MovieInfo: {
          include: {
            files: { where: { type: 2 } },
            actresses: true,
          },
        },
      },
      skip,
      take: DEFAULT_PAGE_SIZE,
      orderBy: { createdTime: "desc" },
    };

    let [collectionMovies, totalCount] = await Promise.all([
      prisma.moviesCollection.findMany(q),
      prisma.moviesCollection.count({ where: q.where }),
    ]);

    collectionMovies = collectionMovies
      .filter((x) => x.MovieInfo)
      .map((x) => ({
        collectedTime: x.createdTime,
        ...formatMovie(x.MovieInfo, {
          collectedMovieCode: new Set([x.movieCode]),
          downloadMovieCode,
        }),
        actresses: x.MovieInfo.actresses.map((actress) => actress.actressName),
      }));

    if (isStack) {
      return {
        movies: createStack(collectionMovies),
      };
    }

    return {
      pagination: getPaginationData(totalCount, page, DEFAULT_PAGE_SIZE),
      movies: collectionMovies,
    };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
}

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
