'use server'

import prisma from "@/app/lib/prisma";
import {revalidatePath} from "next/cache";


export async function toggleCollection(code: string, refreshPath: string): Promise<DataResponse<boolean>> {
    try {
        const existingCollection = await prisma.moviesCollection.findUnique({
            where: {
                movieCode: code,
            },
        });

        if (existingCollection) {
            await prisma.moviesCollection.delete({
                where: {
                    movieCode: code,
                },
            });
            revalidatePath(refreshPath);
            return { code: 200, data: true, msg: "取消收藏成功" };
        }

        await prisma.moviesCollection.create({
            data: {
                movieCode: code,
            },
        });
        revalidatePath(refreshPath);
        return { code: 200, data: true, msg: "收藏成功" };
    } catch (error) {
        console.error("Error collecting movie:", error);
        return { code: 500, msg: "操作失败，请重试" };
    }
}
