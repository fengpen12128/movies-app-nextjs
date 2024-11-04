"use server";

import prisma from "@/app/lib/prisma";
import {
    getCollectionAndDownloadCode,
    handleMovie,
    DEFAULT_PAGE_SIZE,
    getPaginationData,
} from "@/app/actions/utils/commonUtils";
import { movieSelect } from "../querySelect";
import { cookies } from 'next/headers';
import { testMovieData } from "../data";
import _ from "lodash";

export async function getMoviesByActressName({
    page = 1,
    name,
    collected = undefined,
    single = undefined,
    download = undefined,
}: {
    page?: number;
    name: string;
    collected?: string;
    single?: string;
    download?: string;
}): Promise<DataResponse<Movie[]>> {
    const skip = (page - 1) * DEFAULT_PAGE_SIZE;

    const { ctCode, dmCode } = await getCollectionAndDownloadCode();

    const cookieStore = cookies();
    const config: GlobalSettingsConfig = JSON.parse(cookieStore.get('config')?.value || '{}');

    if (process.env.DEMO_ENV == 'true' || config?.displayMode === 'demo') {
        return {
            data: _.shuffle(testMovieData).slice(0, _.random(5, 10)),
            code: 200,
        };
    }


    let q = {
        select: movieSelect,
        orderBy: {
            releaseDate: "desc" as const,
        },
        where: {
            ...(single === undefined && {
                actresses: {
                    some: {
                        actressName: name,
                    },
                },
            }),

            ...(collected === 'true' && {
                code: {
                    in: Array.from(ctCode),
                },
            }),
            ...(collected === 'false' && {
                code: {
                    notIn: Array.from(ctCode),
                },
            }),
            ...(single === 'true' && {
                AND: [
                    {
                        actresses: {
                            some: {
                                actressName: name,
                            },
                        },
                    },
                    {
                        actresses: {
                            none: {
                                NOT: {
                                    actressName: name,
                                },
                            },
                        },
                    },
                ],
            }),
            ...(single === 'false' && {
                AND: [
                    {
                        actresses: {
                            some: {
                                actressName: name,
                            },
                        },
                    },
                    {
                        actresses: {
                            some: {
                                NOT: {
                                    actressName: name,
                                },
                            },
                        },
                    },
                ],
            }),
            ...(download === 'true' && {
                code: {
                    in: Array.from(dmCode),
                },
            }),
            ...(download === 'false' && {
                code: {
                    notIn: Array.from(dmCode),
                },
            }),
        },
        skip,
        take: DEFAULT_PAGE_SIZE,
    };

    try {
        const [actressMovies, totalCount] = await Promise.all([
            prisma.moviesInfo.findMany(q),
            prisma.moviesInfo.count({ where: q.where }),
        ]);

        const movies = handleMovie(actressMovies, {
            ctCode,
            dmCode,
        }, config);

        const pagination = getPaginationData(totalCount, page, DEFAULT_PAGE_SIZE);

        return {
            data: movies as Movie[] ?? [],
            pagination,
            code: 200,
        };
    } catch (error) {
        console.error("Error fetching movies:", error);
        return { code: 500, msg: "Error fetching movies", data: [] };
    }
}
