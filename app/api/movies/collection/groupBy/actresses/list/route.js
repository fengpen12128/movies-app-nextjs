import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const downloadMovies = await prisma.MoviesVideoResource.findMany({
      select: {
        movieCode: true,
      },
    });

    let collectionMovies = await prisma.MoviesCollection.findMany({
      include: {
        MovieInfo: {
          include: {
            files: {
              where: {
                type: 2,
              },
            },
            actresses: true,
          },
        },
      },
      orderBy: {
        createdTime: "desc",
      },
    });

    collectionMovies = collectionMovies.filter((x) => x.MovieInfo);
    collectionMovies = collectionMovies.map((x) => ({
      collectedTime: x.createdTime,
      ...x.MovieInfo,
    }));

    const downloadMovieCode = downloadMovies.map((item) => item.movieCode);

    collectionMovies.forEach((x) => {
      try {
        x.actresses = x.actresses.map((actress) => actress.actressName);
        x.releaseDate = x.releaseDate.toLocaleDateString();
        x.collected = true;
        x.downloaded = downloadMovieCode.includes(x.code);
        x.coverUrl = x.files[0]?.path;
        delete x.files;
      } catch (e) {
        console.error(e);
      }
    });

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
        new Date(b.movies[0].collectedTime) -
        new Date(a.movies[0].collectedTime)
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to load movies: ${error.message}` },
      { status: 500 }
    );
  }
};

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
