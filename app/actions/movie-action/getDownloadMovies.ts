'use server'

import { getCollectionAndDownloadCode, getPaginationData, handleMovie } from "@/app/actions/utils/commonUtils";
import prisma from "@/app/lib/prisma";
import { cookies } from 'next/headers';
import { getDownloadOrder } from "./getOrder";
import { testMovieData } from "../data";

const DEFAULT_PAGE_SIZE = 50;

export async function getDownloadMovies({ page = 1, collected, order = "downloadDesc" }: { page: number, collected?: string, order?: MovieOrder }): Promise<DataResponse<Movie[] | ActressGroupedDownloadMovies[]>> {
    try {
        const skip = (page - 1) * DEFAULT_PAGE_SIZE;

        const cookieStore = cookies();
        const config: GlobalSettingsConfig = JSON.parse(cookieStore.get('config')?.value || '{}');

        if (process.env.DEMO_ENV == 'true' || config?.displayMode === 'demo') {
            return {
                data: testMovieData.slice(skip, skip + DEFAULT_PAGE_SIZE),
                pagination: getPaginationData(testMovieData.length, page, DEFAULT_PAGE_SIZE),
                code: 200,
            };
        }

        const { ctCode, dmCode } = await getCollectionAndDownloadCode();


        let q: any = {
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
            orderBy: getDownloadOrder(order),
            skip,
            distinct: ['movieCode'],
            take: DEFAULT_PAGE_SIZE,
        };

        let [result, totalCount] = await Promise.all([
            prisma.moviesVideoResource.findMany(q),
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

        const pagination = getPaginationData(totalCount, page, DEFAULT_PAGE_SIZE);
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
