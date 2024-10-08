"use server";

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  DEFAULT_PAGE_SIZE,
  getCollectionAndDownloadStatus,
  formatMovie,
  getPaginationData,
} from "./utils";
import dayjs from "dayjs";

export async function getMovies({
  page = 1,
  searchKeyword,
  prefix,
  actressName,
  years,
  tags,
  batchId, // 添加 batchId 参数
}) {
  try {
    const skip = (page - 1) * DEFAULT_PAGE_SIZE;

    // 如果提供了 batchId，先查询 CrawlBatchRecord 获取相关的 code
    let relevantCodes = [];
    if (batchId) {
      const batchRecords = await prisma.crawlBatchRecord.findMany({
        where: { batchId: batchId },
        select: { code: true },
      });
      relevantCodes = batchRecords.map((record) => record.code);
    }

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
        ...(years && { releaseYear: Number(years) }),
        ...(tags && {
          tags: {
            some: {
              tagName: { contains: tags, mode: "insensitive" },
            },
          },
        }),
        ...(batchId && {
          code: { in: relevantCodes },
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

    let a = {
      movies: formattedMovies || [],
      pagination: getPaginationData(totalCount, page, DEFAULT_PAGE_SIZE),
    };

    return a;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return {
      movies: [],
      pagination: {},
    };
  }
}

export async function getDownloadMovies(page = 1, collected) {
  try {
    const pageSize = 50;
    const skip = (page - 1) * pageSize;

    const { collectedMovieCode, downloadMovieCode } =
      await getCollectionAndDownloadStatus();

    let q = {
      where: {
        ...(collected === "true" && {
          movieCode: {
            in: collectedMovieCode,
          },
        }),
        ...(collected === "false" && {
          movieCode: {
            notIn: collectedMovieCode,
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
            tags: true,
          },
        },
      },
      orderBy: {
        createdTime: "desc",
      },
      skip,
      distinct: ["movieCode"],
      take: pageSize,
    };

    let [result, totalCount] = await Promise.all([
      prisma.moviesVideoResource.findMany(q),
      prisma.moviesVideoResource.count({ where: q.where }),
    ]);

    const downloadMovies = result.map((x) => {
      const m = x.MovieInfo;
      return {
        id: m?.id,
        downloadTime: m?.createdTime,
        releaseDate: dayjs(m?.releaseDate || "2000-01-01").format("YYYY-MM-DD"),
        code: m?.code,
        collected: collectedMovieCode.has(m?.code),
        downloaded: true,
        coverUrl: m?.files[0]?.path,
        tags: m?.tags.map((x) => x.tagName),
        rate: String(m?.rate),
        rateNum: String(m?.rateNum),
      };
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
    return {
      pagination: {
        totalCount: 0,
        current: 1,
        pageSize: 10,
        totalPage: 0,
      },
      movies: [],
    };
  }
}
