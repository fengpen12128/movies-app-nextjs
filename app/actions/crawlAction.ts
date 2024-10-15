"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/app/lib/prisma";
import dayjs from "dayjs";
import { processCrawlParams } from "./utils/crawlActionUtils";

interface CrawlInfo {
    id: number;
    batchId: string;
    newlyIncreasedNum: number | null;
    updatedNum: number | null;
    downloadSize: string | null;
    duration: number | null;
    checked: string | null;
    createdTime: string | null;
}

export async function getCrawlInfo(): Promise<CrawlInfo[]> {
    // const crawlInfo = await prisma.crawlInfo.findMany({
    //     where: {
    //         checked: "0",
    //     },
    //     orderBy: {
    //         createdTime: "desc",
    //     },
    // });


    // return crawlInfo.map((x) => ({
    //     ...x,
    //     createdTime: x.createdTime ? dayjs(x.createdTime).format("YYYY-MM-DD HH:mm:ss") : null,
    //     checked: x.checked || "",
    // }));
    return []
}

export async function updateCrawlInfo(id: number): Promise<void> {
    // await prisma.crawlInfo.update({
    //     where: { id },
    //     data: { checked: "1" },
    // });
    revalidatePath("/home");
}

export async function getCrawlParamsWithStatus(batchId: string): Promise<DataResponse<CrawlParams>> {
    try {
        const result = await prisma.crawlStat.findUnique({
            where: { batchId },
            select: { crawlParams: true },
        });
        const crawlParams: CrawlParams = await processCrawlParams(result!.crawlParams);
        return {
            data: crawlParams,
            code: 200,
        };
    } catch (error) {
        console.error("Error fetching crawl params with status:", error);
        return {
            code: 500,
            msg: "Failed to fetch crawl params with status",
        };
    }
}
