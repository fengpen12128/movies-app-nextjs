"use server";

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import {
    DEFAULT_PAGE_SIZE,
    getCollectionAndDownloadCode,
    getPaginationData,
    handleMovie,
} from "./utils/commonUtils";
const movieSelect = {

    id: true,
    tags: true,
    duration: true,
    code: true,
    rate: true,
    rateNum: true,
    releaseDate: true,
    releaseYear: true,
    actresses: {
        select: {
            id: true,
            actressName: true
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
}


export async function deleteActressFav(name: string): Promise<DataResponse<boolean>> {
    try {
        await prisma.actressFav.delete({
            where: {
                actressName: name,
            },
        });
        revalidatePath("/actressFav");
        return { code: 200, msg: "删除成功", data: true };
    } catch (error) {
        console.log(error);
        return { code: 500, msg: "删除失败", data: false };
    }
}

export async function saveActressFav(name: string): Promise<DataResponse<boolean>> {
    try {
        const existingFav = await prisma.actressFav.findUnique({
            where: {
                actressName: name,
            },
        });

        if (existingFav) {
            return { code: 500, msg: "已收藏", data: false };
        }
        await prisma.actressFav.create({
            data: {
                actressName: name,
            },
        });
        revalidatePath("/actressFav");

        return { code: 200, msg: "收藏成功", data: true };
    } catch (error) {
        console.log(error);
        return { code: 500, msg: "收藏失败", data: false };
    }
}

export async function getActressFavList({ page = 1 }: { page: number }): Promise<DataResponse<ActressFav[]>> {
    const skip = (page - 1) * DEFAULT_PAGE_SIZE;

    try {
        const [actressFav, totalCount] = await prisma.$transaction([
            prisma.actressFav.findMany({
                orderBy: { createdTime: 'desc' },
                include: {
                    Actress: { select: { avatarBase64: true } },
                },
                skip,
                take: DEFAULT_PAGE_SIZE,
            }),
            prisma.actressFav.count(),
        ]);

        const handledActressFav = actressFav.map(({ id, actressName, createdTime, Actress }) => ({
            id,
            actressName,
            createdTime,
            avatarBase64: Actress?.avatarBase64,
        }));

        return {
            data: handledActressFav,
            pagination: getPaginationData(totalCount, page, DEFAULT_PAGE_SIZE),
            code: 200,
        };
    } catch (error) {
        console.error('Error fetching actress favorites:', error);
        return { code: 500, msg: 'Failed to fetch actress favorites', data: [] };
    }
}



export async function getMoviesByActress({
    page = 1,
    name,
    collected,
    single,
    download,
}: {
    page: number;
    name: string;
    collected: boolean;
    single: boolean;
    download: boolean;
}) {
    const skip = (page - 1) * DEFAULT_PAGE_SIZE;

    const { ctCode, dmCode } = await getCollectionAndDownloadCode();

    let q = {
        select: movieSelect,
        orderBy: {
            releaseDate: "desc" as const,
        },
        where: {
            ...(!single && {
                actresses: {
                    some: {
                        actressName: name,
                    },
                },
            }),

            ...(collected && {
                code: {
                    in: Array.from(ctCode),
                },
            }),
            ...(!collected && {
                code: {
                    notIn: Array.from(ctCode),
                },
            }),
            ...(single && {
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
            ...(!single && {
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
            ...(download && {
                code: {
                    in: Array.from(dmCode),
                },
            }),
            ...(!download && {
                code: {
                    notIn: Array.from(dmCode),
                },
            }),
        },
        skip,
        take: DEFAULT_PAGE_SIZE,
    };

    try {
        const [actressRel, totalCount] = await Promise.all([
            prisma.moviesInfo.findMany(q),
            prisma.moviesInfo.count({ where: q.where }),
        ]);


        const movies = handleMovie(actressRel, {
            ctCode,
            dmCode,
        });

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
