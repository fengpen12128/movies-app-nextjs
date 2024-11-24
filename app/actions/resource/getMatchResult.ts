'use server'

import prisma from "@/app/lib/prisma";
import dayjs from "dayjs";

export async function getMatchResult(): Promise<DataResponse<MovieResource[]>> {
    try {
        const movies = await prisma.moviesInfo.findMany({ select: { code: true } });

        let serverData: ResourceServerData[] = [];
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SCRIPT_BACKEND_ENDPOINT}/getDownloadVideo`,
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

        serverData = serverData.sort((a, b) => dayjs(b.downloadDate).diff(dayjs(a.downloadDate)));

        const data = serverData.map((item) => {
            const itemNameLower = item.path.toLowerCase();
            const matchedCode = Array.from(movieCodes).find((code) =>
                itemNameLower.includes(code ?? '')
            );
            return {
                matchCode: matchedCode?.toUpperCase() ?? '',
                size: item.size,
                downloadDate: dayjs(item.downloadDate).toDate(),
                path: item.path,
                isMatched: !!matchedCode,
            };
        });

        const sortedData = data.sort((a, b) => {
            if (a.isMatched === b.isMatched) {
                return dayjs(b.downloadDate).diff(dayjs(a.downloadDate));
            }
            return a.isMatched ? 1 : -1;
        });

        return { data: sortedData as MovieResource[] ?? [], code: 200 };
    } catch (error) {
        console.error(error);
        return { data: [], code: 500, msg: "获取失败" };
    }
}




export async function getUnMatchedResource(): Promise<DataResponse<MovieResource[]>> {
    const data = await prisma.moviesVideoResource.findMany({
        where: {
            isMatched: false
        },
    });

    const dataWithMatched = data.map(item => ({
        ...item,
        isMatched: false
    }));

    return { data: dataWithMatched as MovieResource[] ?? [], code: 200 };
}
