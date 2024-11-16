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
import { testMovieData } from "../data";
import _ from "lodash";



export async function getMoviesByActressId(
    actressId: number,
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE
): Promise<DataResponse<Movie[]>> {
    try {
        const skip = (page - 1) * pageSize;
        const cookieStore = cookies();
        const config: GlobalSettingsConfig = JSON.parse(cookieStore.get('config')?.value || '{}');


        if (process.env.DEMO_ENV == 'true' || config?.displayMode === 'demo') {
            return {
                data: testMovieData.sort(() => Math.random() - 0.5).slice(0, 10),
                code: 200,
            };
        }


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
        }, config);

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


export async function getCollectedMoviesByActressId(
    actressId: number,
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE
): Promise<DataResponse<Movie[]>> {
    try {
        const skip = (page - 1) * pageSize;
        const cookieStore = cookies();
        const config: GlobalSettingsConfig = JSON.parse(cookieStore.get('config')?.value || '{}');

        if (process.env.DEMO_ENV == 'true' || config?.displayMode === 'demo') {
            return {
                data: _.shuffle(testMovieData).slice(0, _.random(5, 10)),
                code: 200,
            };
        }


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
        });

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


export async function getDownloadMoviesByActressId(
    actressId: number,
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE
): Promise<DataResponse<Movie[]>> {
    try {
        const skip = (page - 1) * pageSize;
        const cookieStore = cookies();
        const config: GlobalSettingsConfig = JSON.parse(cookieStore.get('config')?.value || '{}');


        if (process.env.DEMO_ENV == 'true' || config?.displayMode === 'demo') {
            return {
                data: _.shuffle(testMovieData).slice(0, _.random(5, 10)),
                code: 200,
            };
        }

        let moviesQuery: any = {
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

        const [downloadMovies, totalCount] = await Promise.all([
            prisma.moviesVideoResource.findMany(moviesQuery),
            prisma.moviesVideoResource.count({ where: moviesQuery.where }),
        ]);

        const { ctCode, dmCode } = await getCollectionAndDownloadCode();

        const movies = downloadMovies
            .filter((x: any) => x.MovieInfo)
            .map((x: any) => ({
                collectedTime: x.downloadDate,
                ...x.MovieInfo,
                rate: Number(x.MovieInfo?.rate ?? 0)
            }));

        const handled = handleMovie(movies, {
            ctCode,
            dmCode,
        });

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
