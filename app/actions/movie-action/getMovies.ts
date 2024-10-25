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
import { getDefaultOrder } from "./getOrder";
import { testMovieData } from "../data";

export async function getMovies({
    page = 1,
    search,
    prefix,
    actressName,
    years,
    tags,
    batchId,
    filter,
    order = "releaseDate",
    maker
}: MovieQueryParams): Promise<DataResponse<Movie[]>> {
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

        let relevantCodes: string[] = [];
        if (batchId) {
            const batchRecords = await prisma.crawlBatchRecord.findMany({
                where: { batchId: batchId },
                select: { code: true },
            });
            relevantCodes = batchRecords.map((record: { code: string }) => record.code);
        }
        const { ctCode, dmCode } = await getCollectionAndDownloadCode();

        const filterArr = filter?.split(",") || [];

        const createPartWhereByFilter = async (filterArr: string[]) => {
            if (filterArr.includes("latest")) {
                return {
                    createdTime: {
                        gte: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000)
                    }
                }
            }
            if (filterArr.includes("nd")) {
                return {
                    code: {
                        notIn: dmCode
                    }
                }
            }

            if (filterArr.includes("nc")) {
                return {
                    code: {
                        notIn: ctCode
                    }
                }
            }
        }

        const filterWhere = await createPartWhereByFilter(filterArr)

        let moviesQuery: any = {
            skip,
            take: DEFAULT_PAGE_SIZE,
            orderBy: getDefaultOrder(order),
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
                ...(maker && { maker }),
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
                ...(filterWhere)
            },
        };

        const [movies, totalCount] = await Promise.all([
            prisma.moviesInfo.findMany(moviesQuery),
            prisma.moviesInfo.count({ where: moviesQuery.where }),
        ]);


        const handled = handleMovie(movies, {
            ctCode,
            dmCode,
        });
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
