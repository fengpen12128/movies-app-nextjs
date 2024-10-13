"use server";

import prisma from "@/app/lib/prisma";


export async function getMagnetLinks(movieId: number): Promise<DataResponse<MagnetLink[]>> {

    try {
        const magnetLinks = await prisma.magnetLinks.findMany({
            where: { moviesId: movieId },
            select: {
                id: true,
                linkUrl: true,
                size: true,
                uploadTime: true
            }
        });
        return {
            code: 200,
            data: magnetLinks
        }
    } catch (error) {
        console.error("Error fetching magnet links:", error);
        return { code: 500, msg: "Error fetching magnet links", data: [] };
    }

}
