'use server'

import { getCollectionAndDownloadCode, getPaginationData, handleMovie } from "@/app/actions/utils/commonUtils";
import prisma from "@/app/lib/prisma";
import { cookies } from 'next/headers';

export async function getDownloadMovies(page = 1, collected: string): Promise<DataResponse<Movie[]>> {
    try {
        const skip = (page - 1) * 50;

        const { ctCode, dmCode } = await getCollectionAndDownloadCode();
        const cookieStore = cookies();
        const config: GlobalSettingsConfig = JSON.parse(cookieStore.get('config')?.value || '{}');



        let q = {
            where: {
                movieCode: {
                    ...(collected === 'true' && { in: ctCode }),
                    ...(collected === 'false' && { notIn: ctCode }),
                },
            },
            include: {
                MovieInfo: {
                    include: {
                        files: {
                            where: {
                                type: 2,
                            },
                        },
                        tags: {
                            select: {
                                id: true,
                                tagName: true
                            }
                        }
                    },
                },
            },
            orderBy: { createdTime: 'desc' },
            skip,
            distinct: ['movieCode'],
            take: 50,
        };

        let [result, totalCount] = await Promise.all([
            prisma.moviesVideoResource.findMany(q as any),
            prisma.moviesVideoResource.count({ where: q.where }),
        ]);

        const downloadMovies = result.map((x: any) => {
            const m = x.MovieInfo;
            const downloadTime = x.createdTime;
            delete x.createdTime;
            delete x.MovieInfo;
            return {
                downloadTime,
                ...x,
                ...m,
                rate: Number(m?.rate ?? 0)
            };
        });




        const pagination = getPaginationData(totalCount, page, 50);
        const handled = handleMovie(downloadMovies, {
            ctCode,
            dmCode,
        }, config);



        return {
            data: handled as Movie[],
            pagination,
            code: 200,
        };
    } catch (error) {
        console.error("Error fetching download movies:", error);
        return {
            code: 500,
            msg: "Error fetching download movies",
            data: [],
        };
    }
}
