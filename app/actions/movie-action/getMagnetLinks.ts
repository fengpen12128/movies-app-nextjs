"use server";

import prisma from "@/app/lib/prisma";
import { testMagnetLinks } from "../data";
import { cookies } from "next/headers";
import _ from "lodash";

export async function getMagnetLinks(movieId: number): Promise<DataResponse<MagnetLink[]>> {

    const sizeToBytes = (size: string | null): number => {
        if (!size) return -1; // 如果 size 为空，返回 -1
        const units = { 'B': 1, 'KB': 1024, 'MB': 1024 ** 2, 'GB': 1024 ** 3, 'TB': 1024 ** 4 };
        const match = size.match(/^(\d+(\.\d+)?)\s*(B|KB|MB|GB|TB)$/i);
        if (!match) return -1;
        const num = parseFloat(match[1]);
        const unit = match[3].toUpperCase();
        return num * units[unit as keyof typeof units];

    }

    const cookieStore = await cookies()
    const config: GlobalSettingsConfig = JSON.parse(cookieStore.get('config')?.value || '{}');

    if (process.env.DEMO_ENV == 'true' || config.displayMode === 'demo') {
        return {
            code: 200,
            data: _.sampleSize(testMagnetLinks, Math.random() * 6 + 5)
        }
    }

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

        // 对磁力链接进行排序
        const sortedMagnetLinks = magnetLinks.sort((a, b) => {
            const sizeA = sizeToBytes(a.size);
            const sizeB = sizeToBytes(b.size);
            return sizeB - sizeA; // 降序排序
        });

        return {
            code: 200,
            data: sortedMagnetLinks
        }
    } catch (error) {
        console.error("Error fetching magnet links:", error);
        return { code: 500, msg: "Error fetching magnet links", data: [] };
    }
}
