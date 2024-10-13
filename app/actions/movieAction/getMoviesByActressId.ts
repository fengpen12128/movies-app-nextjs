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



export async function getMoviesByActressId(
    actressId: number,
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE
): Promise<DataResponse<Movie[]>> {
    try {
        const skip = (page - 1) * pageSize;
        const cookieStore = cookies();
        const config: GlobalSettingsConfig = JSON.parse(cookieStore.get('config')?.value || '{}');

        let moviesQuery = {
            skip,
            take: pageSize,
            orderBy: { releaseDate: "desc" as const },
            select: movieSelect,
            where: {
                actresses: {
                    some: {
                        id: actressId
                    }
                }
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

        const pagination = getPaginationData(totalCount, page, pageSize);

        return {
            data: handled as Movie[] || [],
            pagination,
            code: 200,
        };
    } catch (error) {
        console.error("Error fetching movies by actress ID:", error);
        return { code: 500, msg: "Error fetching movies by actress ID", data: [] };
    }
}
