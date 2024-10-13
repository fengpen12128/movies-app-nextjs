'use server'

import {
    DEFAULT_PAGE_SIZE,
    getCollectionAndDownloadCode,
    getPaginationData,
    handleMovie
} from "@/app/actions/utils/commonUtils";
import {cookies} from "next/headers";
import prisma from "@/app/lib/prisma";


export async function getCollectedMoviesByActressId(
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
            orderBy: { createdTime: "desc" as const },
            where: {
                MovieInfo: {
                    actresses: {
                        some: {
                            id: actressId
                        }
                    }
                }
            },
            include: {
                MovieInfo: {
                    include: {
                        files: { where: { type: 2 } },
                        actresses: {
                            select: {
                                id: true,
                                actressName: true
                            }
                        },
                        tags: {
                            select: {
                                id: true,
                                tagName: true
                            }
                        }
                    }
                }
            }
        };

        const [collectedMovies, totalCount] = await Promise.all([
            prisma.moviesCollection.findMany(moviesQuery),
            prisma.moviesCollection.count({ where: moviesQuery.where }),
        ]);

        const { ctCode, dmCode } = await getCollectionAndDownloadCode();

        const movies = collectedMovies
            .filter((x: any) => x.MovieInfo)
            .map(x => ({
                collectedTime: x.createdTime,
                ...x.MovieInfo,
                rate: Number(x.MovieInfo?.rate ?? 0)
            }));

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
        console.error("Error fetching collected movies by actress ID:", error);
        return { code: 500, msg: "Error fetching collected movies by actress ID", data: [] };
    }
}
