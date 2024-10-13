"use server";

import prisma from "@/app/lib/prisma";
import {
} from "@/app/actions/utils/commonUtils";
import { filesize } from "filesize";



export async function getVideoResource(movieId: number): Promise<DataResponse<VideoResource[]>> {

    try {
        const movie = await prisma.moviesInfo.findUnique({
            where: { id: movieId },
            select: { code: true }
        });

        const videoResource = await prisma.moviesVideoResource.findMany({
            where: { movieCode: movie?.code },
            select: {
                path: true,
                createdTime: true,
                size: true,
                id: true
            }
        });

        const updatedResources = await Promise.all(
            videoResource.map(async (x: any) => {
                try {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_VIDEO_SERVER_PATH}${x.path}`,
                        {
                            method: "HEAD",
                        }
                    );
                    const size = res.headers.get("Content-Length") || 0;
                    return { ...x, size: filesize(size) };
                } catch (error) {
                    console.error("Error fetching video size:", error);
                    return x;
                }
            })
        );

        return {
            code: 200,
            data: updatedResources || []
        }
    } catch (error) {
        console.error("Error fetching video resource:", error);
        return { code: 500, msg: "Error fetching video resource", data: [] };
    }

}
