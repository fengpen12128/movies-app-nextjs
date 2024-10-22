'use server'

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";


export async function saveCollectionIfNotExists(movieCode: string): Promise<DataResponse<void>> {

    try {
        const existingCollection = await prisma.moviesCollection.findUnique({
            where: {
                movieCode: movieCode,
            },
        });

        if (existingCollection) {
            return { code: 200, msg: "" };
        }

        await prisma.moviesCollection.create({
            data: {
                movieCode: movieCode,
            },
        });
        revalidatePath("/collection");
        return { code: 200 };

    } catch (error) {
        console.error("Error saving collection:", error);
        return { code: 500, msg: `收藏${movieCode}失败` };
    }

}


export async function toggleCollection(movieId: number, refreshPath: string): Promise<DataResponse<boolean>> {
    try {
        const movie = await prisma.moviesInfo.findUnique({
            where: {
                id: movieId,
            },
        });
        if (!movie) {
            return { code: 500, msg: "电影不存在" };
        }
        const existingCollection = await prisma.moviesCollection.findUnique({
            where: {
                movieCode: movie.code!,
            },
        });

        if (existingCollection) {
            await prisma.moviesCollection.delete({
                where: {
                    movieCode: movie.code!,
                },
            });
            revalidatePath(refreshPath);
            return { code: 200, data: true, msg: "取消收藏成功" };
        }

        await prisma.moviesCollection.create({
            data: {
                movieCode: movie.code!,
            },
        });
        revalidatePath(refreshPath);
        return { code: 200, data: true, msg: "收藏成功" };
    } catch (error) {
        console.error("Error collecting movie:", error);
        return { code: 500, msg: "操作失败，请重试" };
    }
}
