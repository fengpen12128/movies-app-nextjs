"use server";

import prisma from "@/app/lib/prisma";
import {
    getCollectionAndDownloadCode,
    handleMovieInAdmin,
    DEFAULT_PAGE_SIZE,
    getPaginationData,
} from "@/app/actions/utils/commonUtils";
import { MovieTable } from "@/app/admin/table/moviesManager/schema";
import { getMoviesManagerOrder } from "@/app/actions/movie-action/getOrder";
export async function getMoviesList({
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    search,
    prefix,
    actressName,
    years,
    tags,
    batchNum,
    filter,
    order = "releaseDate"
}: MovieQueryParams = {}): Promise<DataResponse<MovieTable[]>> {
    try {
        const skip = (page - 1) * pageSize;

        let relevantCodes: string[] = [];
        if (batchNum) {
            const batchRecords = await prisma.crawlBatchRecord.findMany({
                where: { batchNum },
                select: { code: true },
            });
            relevantCodes = batchRecords.map((record: { code: string }) => record.code);
        }

        let moviesQuery: any = {
            skip,
            take: pageSize,
            orderBy: getMoviesManagerOrder(order),
            select: {
                id: true,
                tags: true,
                duration: true,
                batchNum: true,
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

            },
        };

        const [movies, totalCount] = await Promise.all([
            prisma.moviesInfo.findMany(moviesQuery),
            prisma.moviesInfo.count({ where: moviesQuery.where }),
        ]);

        const handled = handleMovieInAdmin(movies);
        const pagination = getPaginationData(totalCount, page, pageSize);



        return {
            data: handled as MovieTable[] || [],
            pagination,
            code: 200,
        };
    } catch (error) {
        console.error("Error fetching movies:", error);
        return { code: 500, msg: "Error fetching movies", data: [] };
    }
}
