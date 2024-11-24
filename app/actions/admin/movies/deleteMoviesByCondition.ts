"use server";

import prisma from "@/app/lib/prisma";
import { deleteMovies } from "./deleteMovies";

export async function deleteMoviesByCondition({
    search,
    prefix,
    actressName,
    years,
    tags,
    batchNum,
    filter,
}: Omit<MovieQueryParams, 'page' | 'pageSize' | 'order'> = {}): Promise<DataResponse<any>> {
    try {
        // 获取符合条件的电影代码列表
        let relevantCodes: string[] = [];
        if (batchNum) {
            const batchRecords = await prisma.crawlBatchRecord.findMany({
                where: { batchNum: batchNum },
                select: { code: true },
            });
            relevantCodes = batchRecords.map((record: { code: string }) => record.code);
        }

        // 构建查询条件
        const whereCondition: any = {
            deletedAt: null,
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
            ...(years && { releaseYear: Number(years) }),
            ...(tags && {
                tags: {
                    some: {
                        tagName: { contains: tags, mode: "insensitive" },
                    },
                },
            }),
            ...(batchNum && {
                code: { in: relevantCodes },
            }),
        };

        // 获取要删除的记录的 ID 列表
        const moviesToDelete = await prisma.moviesInfo.findMany({
            where: whereCondition,
            select: { id: true },
        });

        if (moviesToDelete.length === 0) {
            return {
                code: 500,
                msg: "没有找到符合条件的记录",
            };
        }

        // 调用 deleteMovies 函数执行删除操作
        const movieIds = moviesToDelete.map(movie => movie.id);
        const deleteResult = await deleteMovies(movieIds);

        return {
            code: 200,
            msg: deleteResult.msg,
            data: movieIds.length,
        };
    } catch (error) {
        console.error("Error deleting movies:", error);
        return {
            code: 500,
            msg: "删除失败",
        };
    }
}
