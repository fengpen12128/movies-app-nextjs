"use server";

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import dayjs from "dayjs";
import {
  DEFAULT_PAGE_SIZE,
  getCollectionAndDownloadStatus,
  getPaginationData,
} from "./utils";
import { actressFavQuery, moviesByActressQuery } from "./queryObjects";

export async function deleteActressFav(name) {
  try {
    await prisma.actressFav.delete({
      where: {
        actressName: name,
      },
    });
    revalidatePath("/actressFav");
    return [true, "删除成功"];
  } catch (error) {
    console.log(error);
    return [false, "删除失败"];
  }
}

export async function saveActressFav(name) {
  try {
    const existingFav = await prisma.actressFav.findUnique({
      where: {
        actressName: name,
      },
    });

    if (existingFav) {
      return [false, "已收藏"];
    }
    await prisma.actressFav.create({
      data: {
        actressName: name,
      },
    });
    revalidatePath("/actressFav");

    return [true, "收藏成功"];
  } catch (error) {
    console.log(error);
    return [false, "收藏失败"];
  }
}

export async function getActressFavList({ page = 1 }) {
  const skip = (page - 1) * DEFAULT_PAGE_SIZE;

  try {
    let q = {
      ...actressFavQuery,
      skip,
      take: DEFAULT_PAGE_SIZE,
    };

    const [actressFav, totalCount] = await Promise.all([
      prisma.actressFav.findMany(q),
      prisma.actressFav.count(),
    ]);

    const handledActressFav = actressFav.map((x) => ({
      id: x.id,
      actressName: x.actressName,
      createdTime: x.createdTime,
      avatarBase64: x.Actress.avatarBase64,
    }));

    return {
      pagination: getPaginationData(totalCount, page, DEFAULT_PAGE_SIZE),
      favActresses: handledActressFav,
    };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
}

export async function getMoviesByActress({
  page = 1,
  name,
  collected,
  single,
  download,
}) {
  const skip = (page - 1) * DEFAULT_PAGE_SIZE;

  const { collectedMovieCode, downloadMovieCode } =
    await getCollectionAndDownloadStatus();

  let q = {
    ...moviesByActressQuery,
    where: {
      ...(!single && {
        actresses: {
          some: {
            actressName: name,
          },
        },
      }),

      ...(collected === "true" && {
        code: {
          in: Array.from(collectedMovieCode),
        },
      }),
      ...(collected === "false" && {
        code: {
          notIn: Array.from(collectedMovieCode),
        },
      }),
      ...(single === "true" && {
        AND: [
          {
            actresses: {
              some: {
                actressName: name,
              },
            },
          },
          {
            actresses: {
              none: {
                NOT: {
                  actressName: name,
                },
              },
            },
          },
        ],
      }),
      ...(single === "false" && {
        AND: [
          {
            actresses: {
              some: {
                actressName: name,
              },
            },
          },
          {
            actresses: {
              some: {
                NOT: {
                  actressName: name,
                },
              },
            },
          },
        ],
      }),
      ...(download === "true" && {
        code: {
          in: Array.from(downloadMovieCode),
        },
      }),
      ...(download === "false" && {
        code: {
          notIn: Array.from(downloadMovieCode),
        },
      }),
    },
    skip,
    take: DEFAULT_PAGE_SIZE,
  };

  try {
    const [actressRel, totalCount] = await Promise.all([
      prisma.moviesInfo.findMany(q),
      prisma.moviesInfo.count({ where: q.where }),
    ]);

    const { collectedMovieCode, downloadMovieCode } =
      await getCollectionAndDownloadStatus();

    const formattedActressRel = actressRel.map((movie) => ({
      id: movie.id,
      code: movie.code,
      releaseDate: dayjs(movie.releaseDate).format("YYYY-MM-DD"),
      rate: String(movie.rate),
      rateNum: movie.rateNum,
      coverUrl: movie.files[0]?.path || "",
      tags: movie.tags,
      collected: collectedMovieCode.has(movie.code),
      downloaded: downloadMovieCode.has(movie.code),
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
