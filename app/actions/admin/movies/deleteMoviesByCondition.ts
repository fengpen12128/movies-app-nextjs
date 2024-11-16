"use server";

import prisma from "@/app/lib/prisma";

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
                where: { batchNum },
                select: { code: true },
            });
            relevantCodes = batchRecords.map((record: { code: string }) => record.code);
        }

        // 构建删除条件，与 getMoviesList 使用相同的查询条件
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

        // 获取要删除的记录数量
        const countToDelete = await prisma.moviesInfo.count({
            where: whereCondition,
        });

        if (countToDelete === 0) {
            return {
                code: 500,
                msg: "没有找到符合条件的记录",
            };
        }

        // 执行软删除操作
        const deleteResult = await prisma.moviesInfo.updateMany({
            where: whereCondition,
            data: {
                deletedAt: new Date(),
            },
        });

        return {
            code: 200,
            msg: `成功删除 ${deleteResult.count} 条记录`,
            data: deleteResult.count,
        };
    } catch (error) {
        console.error("Error deleting movies:", error);
        return {
            code: 500,
            msg: "删除失败",
        };
    }
}
