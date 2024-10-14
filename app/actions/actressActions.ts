"use server";

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import {
    DEFAULT_PAGE_SIZE,
    getPaginationData,
} from "./utils/commonUtils";



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

export async function getActressFavList({ page = 1 }: { page?: number }): Promise<DataResponse<ActressFav[]>> {
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
            data: handledActressFav ?? [],
            pagination: getPaginationData(totalCount, page, DEFAULT_PAGE_SIZE),
            code: 200,
        };
    } catch (error) {
        console.error('Error fetching actress favorites:', error);
        return { code: 500, msg: 'Failed to fetch actress favorites', data: [] };
    }
}

export async function getActressFavStatus(name: string): Promise<DataResponse<boolean>> {
    try {
        const existingFav = await prisma.actressFav.findUnique({
            where: {
                actressName: name,
            },
        });
        return { code: 200, data: !!existingFav };
    } catch (error) {
        console.error('Error fetching actress favorites:', error);
        return { code: 500, msg: '获取收藏状态失败', data: false };
    }
}


export async function toggleActressFav(name: string): Promise<DataResponse<boolean>> {
    try {
        const existingFav = await prisma.actressFav.findUnique({
            where: {
                actressName: name,
            },
        });

        if (existingFav) {
            await prisma.actressFav.delete({
                where: {
                    actressName: name,
                },
            });
            return { code: 200, data: true, msg: "取消收藏成功" };
        }

        await prisma.actressFav.create({
            data: {
                actressName: name,
            },
        });
        return { code: 200, data: true, msg: "收藏成功" };
    } catch (error) {
        console.error("Error collecting movie:", error);
        return { code: 500, msg: "操作失败，请重试" };
    }
}
