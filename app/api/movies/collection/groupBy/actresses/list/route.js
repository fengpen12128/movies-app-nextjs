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
            files: true,
            actresses: true,
          },
        },
      },
    });

    console.log(collectionMovies);

    collectionMovies = collectionMovies.map((x) => ({
      collectedTime: x.createdTime,
      ...x.MovieInfo,
    }));

    const downloadMoviesCode = downloadMovies.map((item) => item.movieCode);

    collectionMovies.forEach((x) => {
      x.actresses = x.actresses.map((actress) => actress.actressName);
      x.releaseDate = x.releaseDate.toLocaleDateString();
      x.collected = true;
      x.downloaded = downloadMoviesCode.includes(x.code);
      x.coverUrl = x.files[0]?.path;
      delete x.files;
    });

    const groupedData = groupByActress(collectionMovies, "actresses");
    let p = Object.keys(groupedData).map((x) => ({
      actress: x,
      movies:
        groupedData[x].length > 1
          ? groupedData[x].sort(
              (a, b) => new Date(b.collectedTime) - new Date(a.collectedTime)
            )
          : groupedData[x],
    }));

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

    let result = [...single, ...p.filter((x) => x.movies.length > 1)].sort(
      (a, b) =>
        new Date(b.movies[0].collectedTime) -
        new Date(a.movies[0].collectedTime)
    );

    return NextResponse.json(result);
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
