'use server'

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleCollection(code, refreshPath) {
  try {
    // Check if the movie is already collected
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
      return [true, "取消收藏成功"];
    }

    // If not collected, add to collection
    await prisma.moviesCollection.create({
      data: {
        movieCode: code,
      },
    });
    revalidatePath(refreshPath);
    return [true, "收藏成功"];
  } catch (error) {
    console.error("Error collecting movie:", error);
    return [false, "操作失败，请重试"];
  }
}
