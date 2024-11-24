'use server'

import prisma from "@/app/lib/prisma";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { saveCollectionIfNotExists } from "@/app/actions";
import { message } from "react-message-popup";

export async function getResourceList(st?: string): Promise<DataResponse<MovieResource[]>> {
    try {
        const [movies, movieResources] = await Promise.all([
            prisma.moviesInfo.findMany({ select: { code: true } }),
            prisma.moviesVideoResource.findMany({ select: { matchCode: true } }),
        ]);

        let serverData: ResourceServerData[] = [];
        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_VIDEO_META_PARSER,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Cache-Control": "no-cache",
                        "Pragma": "no-cache",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            serverData = await response.json();
        } catch (fetchError) {
            console.error("Error fetching video data:", fetchError);
        }

        const movieCodes = movies.map((movie) => movie.code?.toLowerCase());
        const movieResourcesCodes = movieResources.map((movie) => movie.matchCode?.toLowerCase())

        serverData = serverData.sort((a, b) => dayjs(b.downloadDate).diff(dayjs(a.downloadDate)));

        const data = serverData.map((item) => {
            const itemNameLower = item.path.toLowerCase();
            const matchedCode = Array.from(movieCodes).find((code) =>
                itemNameLower.includes(code ?? '')
            );
            return {
                matchCode: matchedCode?.toUpperCase() || '',
                size: item.size,
                downloadDate: dayjs(item.downloadDate).toDate(),
                path: item.path,
                isMatched: matchedCode ? movieResourcesCodes.includes(matchedCode.toLowerCase()) : false,
                isPair: !!matchedCode,
            };
        });
        let res: any = [];

        if (st === "is") {
            res = data.filter((item) => item.isPair);
        } else if (st === "un") {
            res = data.filter((item) => !item.isPair);
        }

        return { data: res ?? [], code: 200, msg: "获取成功" };
    } catch (error) {
        console.error(error);
        return { data: [], code: 500, msg: "获取失败" };
    }
}

export async function saveResourceList(resourceList: MovieResource[] | MovieResource): Promise<DataResponse<boolean>> {
    const resources = Array.isArray(resourceList) ? resourceList : [resourceList];
    try {
        await prisma.moviesVideoResource.createMany({
            data: resources.map((item) => ({
                matchCode: item.matchCode || '-',
                path: item.path,
                size: String(item.size),
                isMatched: item.matchCode ? true : false,
            })),
            skipDuplicates: true,
        });

        resources.forEach(async (item) => {
            const { code, msg } = await saveCollectionIfNotExists(item.matchCode ?? '');
            if (code !== 200) {
                message.error(msg!);
            }
        });

        revalidatePath("/matching2");

        return { data: true, code: 200, msg: "保存成功" };
    } catch (error) {
        console.error("Error saving match results:", error);
        return { data: false, code: 500, msg: "保存失败" };
    }
}
