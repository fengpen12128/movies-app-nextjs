'use server'

import { prisma } from "@/app/lib/prisma";
import {
    getPaginationData,
} from "@/app/actions/utils/commonUtils";


export async function runCrawl(config: CrawlConfig): Promise<DataResponse<CrawlResponse>> {
    try {
        const response = await fetch(`${process.env.CRAWLER_SERVER}/run-spider`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(config),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: any = await response.json();
        console.log("response_XXXXXXXXXXXXX", data);


        // Ensure the returned data contains jobId and batchId
        if (!data.jobId || !data.batchId) {
            throw new Error("Invalid response from crawler server");
        }

        return {
            data: {
                batchId: data.batchId,
                jobId: data.jobId.jobid
            },
            code: 200,
        };
    } catch (error) {
        console.error("Error running crawl:", error);
        return {
            msg: `error: ${error}`,
            code: 500
        }

    }
}

export async function getCrawlRecord(page: number = 1, limit: number = 20): Promise<DataResponse<CrawlStat[]>> {
    const skip = (page - 1) * limit;
    try {
        const [crawlStats, count] = await Promise.all([
            prisma.crawlStat.findMany({
                skip,
                take: limit,
                orderBy: { startedTime: "desc" },
            }),
            prisma.crawlStat.count(),
        ]);

        const processedCrawlParams = await Promise.all(
            crawlStats.map(async (stat: any) => {
                return await processCrawlParams(stat);
            })
        );

        return {
            data: processedCrawlParams,
            pagination: getPaginationData(count, page, limit),
            code: 200
        }
    } catch (error) {
        return {
            msg: `error: ${error}`,
            code: 500
        }
    }
}

export async function getCrawlRecordByBatchId(batchId: string): Promise<DataResponse<CrawlStat>> {
    const crawlStat = await prisma.crawlStat.findUnique({
        where: { batchId },
    });
    if (!crawlStat) {
        return {
            msg: `Crawl record not found for batchId: ${batchId}`,
            code: 500
        }
    }
    const processedCrawlParams = await processCrawlParams(crawlStat);
    const urls = JSON.parse((crawlStat?.crawlParams as any).urls) as CrawlUrl[];
    return {
        data: {
            ...processedCrawlParams,
            urls: urls
        },
        code: 200
    }
}

export async function processCrawlParams(parsedParams: any): Promise<CrawlStat> {

    let crawlStatus: CrawlStatus = "error";
    const statusResponse = await getSpiderStatus(parsedParams.jobId);
    if (statusResponse.code === 200 && statusResponse.data) {
        crawlStatus = statusResponse.data;
    }

    return {
        ...parsedParams,
        crawlStatus
    };
}

export async function getSpiderStatus(jobId: string): Promise<DataResponse<CrawlStatus>> {
    try {
        const response = await fetch(
            `${process.env.CRAWLER_SERVER}/spider-status/${jobId}`,
            { cache: 'no-store' } // 确保每次都获取最新状态
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch spider status: ${response.statusText}`);
        }
        const data: { status: CrawlStatus } = await response.json();
        return {
            data: data.status,
            code: 200
        };
    } catch (error) {
        console.error("Error fetching spider status:", error);
        return {
            msg: `Error fetching spider status: ${error instanceof Error ? error.message : String(error)}`,
            code: 500
        };
    }
}

export async function getSpiderLog(jobId: string): Promise<DataResponse<string>> {


    try {
        const response = await fetch(
            `${process.env.CRAWLER_SERVER}/spider-log/${jobId}`,
            {
                cache: "no-store",
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text();

        return {
            data: data,
            code: 200
        };
    } catch (error) {
        console.error("Error fetching spider log:", error);
        return {
            msg: `Failed to fetch spider log: ${error instanceof Error ? error.message : String(error)}`,
            code: 500
        };
    }
}

export async function getCrawlScheduledUrls(): Promise<DataResponse<CrawlUrl[]>> {
    try {
        const response = await fetch(`${process.env.CRAWLER_SERVER}/scheduled-urls`);
        if (!response.ok) {
            throw new Error("Failed to fetch scheduled URLs");
        }
        const data = await response.json();
        const scheduledUrls = data.scheduledUrls;

        let formattedUrls: CrawlUrl[] = [];
        if (scheduledUrls && scheduledUrls.length > 0) {
            formattedUrls = scheduledUrls.map(([url, maxPage]: [string, number]) => ({
                url,
                maxPage,
            }));
        }

        return {
            data: formattedUrls,
            code: 200
        };
    } catch (error) {
        console.error("Error fetching scheduled URLs:", error);
        return {
            msg: `Error fetching scheduled URLs: ${error instanceof Error ? error.message : String(error)}`,
            code: 500
        };
    }
}
