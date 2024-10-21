"use server";

import prisma from "@/app/lib/prisma";
import { cookies } from 'next/headers';
export async function getMedia(movieId: number): Promise<DataResponse<MoviesMediaUrl>> {

    const cookieStore = cookies();
    const config: GlobalSettingsConfig = JSON.parse(cookieStore.get('config')?.value || '{}');

    if (process.env.DEMO_ENV == 'true' || config.displayMode === 'demo') {
        const videoUrl = process.env.NEXT_PUBLIC_DEMO_VIDEO;
        const coverUrl = `/demo/demo${Math.floor(Math.random() * 30) + 1}.jpg`;
        const introCount = Math.floor(Math.random() * 6) + 5; // 5 to 10 random intro images
        const introUrls = Array.from({ length: introCount }, (_, index) => ({
            id: index + 1,
            path: `/demo/demo${Math.floor(Math.random() * 30) + 1}.jpg`
        }));

        return {
            code: 200,
            data: {
                videoUrl,
                coverUrl,
                introUrls
            }
        }
    }


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
        const videoUrl = handledMedia.find((x) => x.type === 3)?.path;
        const coverUrl = handledMedia.find((x) => x.type === 2)?.path;
        const introUrls = handledMedia
            .filter((x) => x.type === 1)
            .map((x) => ({
                id: x.id,
                path: x.path,
            }));


        return {
            code: 200,
            data: {
                videoUrl,
                coverUrl,
                introUrls
            }
        }
    } catch (error) {
        console.error("Error fetching media:", error);
        return { code: 500, msg: "Error fetching media" };
    }
}
