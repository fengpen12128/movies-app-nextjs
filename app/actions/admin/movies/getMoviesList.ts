"use server";

import prisma from "@/app/lib/prisma";
import {
    getCollectionAndDownloadCode,
    handleMovieInAdmin,
    DEFAULT_PAGE_SIZE,
    getPaginationData,
} from "@/app/actions/utils/commonUtils";

export async function getMoviesList({
    page = 1,
    search,
    prefix,
    actressName,
    years,
    tags,
    batchId,
    filter,
    order = "releaseDate"
}: MovieQueryParams): Promise<DataResponse<Movie[]>> {
    try {
        const skip = (page - 1) * DEFAULT_PAGE_SIZE;


        let relevantCodes: string[] = [];
        if (batchId) {
            const batchRecords = await prisma.crawlBatchRecord.findMany({
                where: { batchId: batchId },
                select: { code: true },
            });
            relevantCodes = batchRecords.map((record: { code: string }) => record.code);
        }
        const { ctCode, dmCode } = await getCollectionAndDownloadCode();



        let moviesQuery: any = {
            skip,
            take: DEFAULT_PAGE_SIZE,
            orderBy: { releaseDate: "desc" as const },
            select: {
                id: true,
                tags: true,
                duration: true,
                code: true,
                rate: true,
                rateNum: true,
                releaseDate: true,
                releaseYear: true,
                createdTime: true,
                updatedTime: true,
                actresses: {
                    select: {
                        id: true,
                        actressName: true
                    }
                },
            },
            where: {
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
                ...(batchId && {
                    code: { in: relevantCodes },
                }),

            },
        };

        const [movies, totalCount] = await Promise.all([
            prisma.moviesInfo.findMany(moviesQuery),
            prisma.moviesInfo.count({ where: moviesQuery.where }),
        ]);


        const handled = handleMovieInAdmin(movies, {
            ctCode,
            dmCode,
        });
        const pagination = getPaginationData(totalCount, page, DEFAULT_PAGE_SIZE);

        return {
            data: handled as Movie[] || [],
            pagination,
            code: 200,
        };
    } catch (error) {
        console.error("Error fetching movies:", error);
        return { code: 500, msg: "Error fetching movies", data: [] };
    }
}
