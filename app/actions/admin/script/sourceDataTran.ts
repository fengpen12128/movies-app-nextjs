'use server'

import prisma from "@/app/lib/prisma";
import { insertMovieData } from "@/app/actions/utils/dataTranScript";
import { revalidatePath } from 'next/cache'

export async function transformSourceData({ batchId, isFullData = false }: { batchId?: string, isFullData: boolean }) {
    if (!isFullData && !batchId) {
        throw new Error("batchId is required when not processing full data");
    }

    try {
        let movieDataArray: any;

        if (isFullData) {
            movieDataArray = await prisma.crawlSourceData.findMany({
                select: { data: true },
            });
        } else {
            movieDataArray = await prisma.crawlSourceData.findMany({
                select: { data: true },
                where: { batchId: batchId },
            });
        }

        console.log("Processing data count: ", movieDataArray.length);

        for (const movieData of movieDataArray) {
            await insertMovieData(movieData.data);
        }

        revalidatePath("/admin");

        return { msg: "transformation completed", count: movieDataArray.length };
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
