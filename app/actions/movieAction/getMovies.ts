"use server";

import prisma from "@/app/lib/prisma";
import {
    getCollectionAndDownloadCode,
    handleMovie,
    DEFAULT_PAGE_SIZE,
    getPaginationData,
} from "@/app/actions/utils/commonUtils";
import { cookies } from 'next/headers';
import { movieSelect } from "../querySelect";



export async function getMovies({
    page = 1,
    search,
    prefix,
    actressName,
    years,
    tags,
    batchId,
}: MovieQueryParams): Promise<DataResponse<Movie[]>> {
    try {
        const skip = (page - 1) * DEFAULT_PAGE_SIZE;
        const cookieStore = cookies();
        const config: GlobalSettingsConfig = JSON.parse(cookieStore.get('config')?.value || '{}');

        // Add a 3-second delay
   //     await new Promise(resolve => setTimeout(resolve, 1000));

        let relevantCodes: string[] = [];
        if (batchId) {
            const batchRecords = await prisma.crawlBatchRecord.findMany({
                where: { batchId: batchId },
                select: { code: true },
            });
            relevantCodes = batchRecords.map((record: { code: string }) => record.code);
        }

        let moviesQuery: any = {
            skip,
            take: DEFAULT_PAGE_SIZE,
            orderBy: { releaseDate: "desc" as const },
            select: movieSelect,
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
        const { ctCode, dmCode } = await getCollectionAndDownloadCode();


        const handled = handleMovie(movies, {
            ctCode,
            dmCode,
        },
            config
        );
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
