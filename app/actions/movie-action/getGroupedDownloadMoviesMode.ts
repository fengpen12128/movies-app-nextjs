"use server";

import prisma from "@/app/lib/prisma";
import { cookies } from 'next/headers';
import { getCollectionAndDownloadCode, getPaginationData, handleMovie } from "../utils/commonUtils";
import { getDownloadOrder } from "./getOrder";

export async function getGroupedDownloadMovies({ page = 1, order = "downloadDesc", pageSize = 50 }: { page?: number, order?: MovieOrder, pageSize?: number }): Promise<DataResponse<ActressGroupedDownloadMovies[]>> {
    const skip = (page - 1) * pageSize;

    const cookieStore = cookies();
    const config: GlobalSettingsConfig = JSON.parse(cookieStore.get('config')?.value || '{}');


    if (process.env.DEMO_ENV == 'true' || config?.displayMode === 'demo') {
        return {
            code: 500,
            msg: "not support now",
        };
    }


    try {
        // 获取所有下载的电影及其演员信息
        const allMoviesWithActress = await prisma.moviesVideoResource.findMany({
            include: {
                MovieInfo: {
                    include: {
                        actresses: {
                            select: {
                                id: true,
                                actressName: true,
                            }
                        },
                        files: {
                            where: {
                                type: 2
                            },
                            select: {
                                path: true,
                                onlineUrl: true
                            }
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
            orderBy: getDownloadOrder(order)
        });

        const cookieStore = cookies();
        const config: GlobalSettingsConfig = JSON.parse(cookieStore.get('config')?.value || '{}');
        const { ctCode, dmCode } = await getCollectionAndDownloadCode();

        const movies = allMoviesWithActress.filter((x) => x.MovieInfo)
        const flatMovies = movies.map(x => ({
            downloadTime: x.createdTime,
            ...x.MovieInfo,
            rate: Number(x.MovieInfo?.rate ?? 0)
        }))

        const handledMovies = handleMovie(flatMovies, {
            ctCode,
            dmCode,
        }) as Movie[];

        // 分组电影
        const groupedByActress = new Map<number, ActressGroupedDownloadMovies>();

        for (const movie of handledMovies) {
            if (movie.actresses && movie.actresses.length <= 2) {
                for (const actress of movie.actresses) {
                    if (!groupedByActress.has(actress.id)) {
                        groupedByActress.set(actress.id, {
                            actress: {
                                id: actress.id,
                                actressName: actress.actressName,
                            },
                            movies: movie,
                            size: 1,
                            grouped: false,
                            latestDownloadDate: movie.downloadTime!,
                        });
                    } else {
                        const group = groupedByActress.get(actress.id)!;
                        group.size++;
                        group.grouped = group.size > 2;
                        if (movie.downloadTime! > group.latestDownloadDate) {
                            group.movies = movie;
                            group.latestDownloadDate = movie.downloadTime!;
                        }
                    }
                }
            } else {
                // 处理演员数量超过2个的电影
                groupedByActress.set(movie.id, {
                    actress: {
                        id: movie.id,
                        actressName: movie.code,
                    },
                    movies: movie,
                    size: 1,
                    grouped: false,
                    latestDownloadDate: movie.downloadTime!,
                });
            }
        }

        // 转换为数组并排序
        let result = Array.from(groupedByActress.values());
        result.sort((a, b) => b.latestDownloadDate.getTime() - a.latestDownloadDate.getTime());

        // 分页处理
        const paginatedResult = result.slice(skip, skip + pageSize);

        return {
            data: paginatedResult,
            pagination: getPaginationData(result.length, page, pageSize),
            code: 200,
        };
    } catch (error) {
        console.error("Error fetching grouped movies by actress:", error);
        return { code: 500, msg: "Error fetching grouped movies by actress", data: [] };
    }
}
