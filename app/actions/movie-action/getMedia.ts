"use server";

import prisma from "@/app/lib/prisma";

export async function getMedia(movieId: number): Promise<DataResponse<MovieMedia[]>> {

    try {
        const media = await prisma.filesInfo.findMany({
            where: { moviesId: movieId },
            select: {
                id: true,
                path: true,
                type: true,
                onlineUrl: true
            }
        });
        const playable = async (url: string) => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 1000);

                const resp = await fetch(url, {
                    method: "HEAD",
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                const size = resp.headers.get("content-length");
                return size && parseInt(size) > 1024 * 10;
            } catch (error) {
                console.error("Error checking playability:", error);
                return false;
            }
        }

        const handledMedia = await Promise.all(media.map(async (x) => {
            const updatedMedia: MovieMedia = {
                id: x.id,
                path: `${process.env.MINIO_PATH}/${x.path}`,
                type: x.type || 0
            };

            if (x.type === 3) {
                const isPlayable = await playable(updatedMedia.path);
                if (!isPlayable) {
                    updatedMedia.useOnline = true;
                    updatedMedia.path = x.onlineUrl || updatedMedia.path;
                }
            }

            return updatedMedia;
        }));

        return {
            code: 200,
            data: handledMedia
        }
    } catch (error) {
        console.error("Error fetching media:", error);
        return { code: 500, msg: "Error fetching media", data: [] };
    }
}
