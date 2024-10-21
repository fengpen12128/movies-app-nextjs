"use server";

import prisma from "@/app/lib/prisma";
import {
    getCollectionAndDownloadCode,
    handleMovie,
    getPaginationData,
} from "@/app/actions/utils/commonUtils";
import { cookies } from 'next/headers';
import { getCollectionOrder } from "./getOrder";
import { testMovieData } from "../data";

const DEFAULT_PAGE_SIZE = 50;

export async function getCollectionMovies({
    page = 1,
    download,
    order = "favoriteDesc"
}: {
    page?: number;
    download?: string;
    order?: MovieOrder
}): Promise<DataResponse<Movie[] | ActressGroupedMovies[]>> {
    try {

        const cookieStore = cookies();
        const config: GlobalSettingsConfig = JSON.parse(cookieStore.get('config')?.value || '{}');
        const skip = (page - 1) * DEFAULT_PAGE_SIZE;


        if (process.env.DEMO_ENV == 'true' || config?.displayMode === 'demo') {
            return {
                data: testMovieData.slice(skip, skip + DEFAULT_PAGE_SIZE),
                pagination: getPaginationData(testMovieData.length, page, DEFAULT_PAGE_SIZE),
                code: 200,
            };
        }


        const { ctCode, dmCode } = await getCollectionAndDownloadCode();


        let q = {
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
                    },
                },
            },
            orderBy: getCollectionOrder(order),
            where: {
                movieCode: {
                    ...(download === "true" && { in: dmCode }),
                    ...(download === "false" && { notIn: dmCode })
                }
            },
            skip: skip,
            take: 50,
        };


        let [collectedMovies, totalCount] = await Promise.all([
            prisma.moviesCollection.findMany(q),
            prisma.moviesCollection.count({ where: q.where }),
        ]);

        const movies = collectedMovies.filter((x: any) => x.MovieInfo)
        const flatMovies = movies.map(x => ({
            collectedTime: x.createdTime,
            ...x.MovieInfo,
            rate: Number(x.MovieInfo?.rate ?? 0)
        }))

        let handledMovies: Movie[] | ActressGroupedMovies[] = [];


        const handled = handleMovie(flatMovies, {
            ctCode,
            dmCode,
        });



        return {
            data: handled as Movie[] || [],
            pagination: getPaginationData(totalCount, page, DEFAULT_PAGE_SIZE),
            code: 200,
        }

    } catch (error) {
        console.error("Error fetching collection movies:", error);
        return { code: 500, msg: "Error fetching collection movies", data: [] };
    }

}


async function groupedMoviesByActress(page: number = 1, pageSize: number = 30): Promise<DataResponse<ActressGroupedMovies[]>> {
    const skip = (page - 1) * pageSize;

    const allMoviesWithActress = await prisma.moviesCollection.findMany({
        include: {
            MovieInfo: {
                include: {
                    actresses: {
                        select: {
                            id: true,
                            actressName: true,
                        }
                    }, // 关联演员信息
                    files: {
                        where: {
                            type: 2
                        },
                        select: {
                            path: true,
                            onlineUrl: true
                        }
                    },
                },
            },
        },
        orderBy: {
            createdTime: 'desc', // 按收藏时间倒序
        },
    });

    const cookieStore = cookies();
    const config: GlobalSettingsConfig = JSON.parse(cookieStore.get('config')?.value || '{}');
    const { ctCode, dmCode } = await getCollectionAndDownloadCode();

    const movies = allMoviesWithActress.filter((x: any) => x.MovieInfo)
    const flatMovies = movies.map(x => ({
        collectedTime: x.createdTime,
        ...x.MovieInfo,
        rate: Number(x.MovieInfo?.rate ?? 0)
    }))

    const handledMovies = handleMovie(flatMovies, {
        ctCode,
        dmCode,
    }) as Movie[];

    // Step 2: 分组电影，过滤掉演员电影数量超过2部的
    const groupedByActress = new Map<number, {
        actress: {
            id: number;
            actressName: string;
        };
        movies: Movie[];
        latestCollectedDate: Date;
    }>();

    // 遍历 handledMovies 中的每个电影收藏
    for (const movieCollection of handledMovies) {
        // 获取与电影收藏相关的女演员，如果没有则为空数组
        const actresses = movieCollection.actresses || [];
        // 遍历电影收藏中的每个女演员
        for (const actress of actresses) {
            // 如果 groupedByActress map 中还没有该女演员，则添加她
            if (!groupedByActress.has(actress.id)) {
                groupedByActress.set(actress.id, {
                    actress: {
                        id: actress.id,
                        actressName: actress.actressName!,
                    },
                    movies: [],
                    latestCollectedDate: movieCollection.collectedTime!, // 初始化为该电影收藏时间
                });
            }
            // 获取该女演员的分组
            const group = groupedByActress.get(actress.id)!;
            // 将电影收藏添加到女演员的分组中
            group.movies.push(movieCollection);
            // 更新该分组的最新收藏时间
            group.latestCollectedDate = new Date(Math.max(
                new Date(group.latestCollectedDate).getTime(),
                new Date(movieCollection.collectedTime!).getTime()
            ));
        }
    }

    // Step 3: 处理超过2部电影的演员
    const finalGroups: ActressGroupedMovies[] = [];
    for (const [_, group] of groupedByActress) {
        // if (group.movies.length > 2) {
        //     // 将超过2部电影的直接作为单独的返回项，限制返回3部
        //     group.movies = group.movies.slice(0, 3);
        // }
        finalGroups.push({
            actress: group.actress,
            movies: group.movies,
            size: group.movies.length,
            latestCollectedDate: group.latestCollectedDate,
        });
    }


    // Step 4: 按组内最近收藏时间倒序排列
    finalGroups.sort((a, b) => b.latestCollectedDate.getTime() - a.latestCollectedDate.getTime());

    // Step 5: 分页处理
    const data = finalGroups.slice(skip, skip + pageSize);

    return { data, pagination: getPaginationData(finalGroups.length, page, pageSize), code: 200 };
}
