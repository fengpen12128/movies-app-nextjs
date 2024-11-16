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

        if (!data.jobId || !data.batchNum) {
            throw new Error("Invalid response from crawler server");
        }

        return {
            data: {
                batchNum: data.batchNum,
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

export async function getCrawlRecord({ page = 1, limit = 20, batchNum }: { page?: number, limit?: number, batchNum?: string }): Promise<DataResponse<CrawlStat[]>> {
    const skip = (page - 1) * limit;
    const q = {
        ...(batchNum && { batchNum })
    }
    try {
        const [crawlStats, count] = await Promise.all([
            prisma.crawlStat.findMany({
                skip,
                take: limit,
                orderBy: { startedTime: "desc" },
                where: q
            }),
            prisma.crawlStat.count({
                where: q
            }),
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

export async function getCrawlRecordByBatchNum(batchNum: string): Promise<DataResponse<CrawlStat>> {
    const crawlStat = await prisma.crawlStat.findUnique({
        where: { batchNum },
    });
    if (!crawlStat) {
        return {
            msg: `Crawl record not found for batchNum: ${batchNum}`,
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

    parsedParams.urls = JSON.parse(parsedParams.crawlParams.urls)

    let crawlStatus: CrawlStatus = "error";
    if (parsedParams.crawlStatus === 1) {
        crawlStatus = "finished";
    } else {
        const statusResponse = await getSpiderStatus(parsedParams.jobId);
        if (statusResponse.code === 200 && statusResponse.data) {
            crawlStatus = statusResponse.data;
        }
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


        const data = await prisma.scheduleCrawlUrl.findMany()

        let formattedUrls: CrawlUrl[] = [];
        if (data && data.length > 0) {
            formattedUrls = data.map(({ url, web }) => ({
                url: url,
                web: web,
                maxPage: 1,
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

export async function getUnDownloadImageNum(): Promise<DataResponse<number>> {
    try {
        console.log('Fetching undownloaded image count...');
        const count = await prisma.downloadUrls.count({
            where: {
                status: {
                    not: 1
                },
                type: {
                    in: [1, 2]
                }
            }
        })
        return {
            data: count,
            code: 200
        }
    } catch (error) {
        return {
            msg: `error: ${error}`,
            code: 500
        }
    }
}

export async function getUnDownloadNum(): Promise<DataResponse<UnDownloadNum>> {
    try {
        const [imageNum, videoNum] = await Promise.all([
            prisma.downloadUrls.count({
                where: {
                    status: {
                        not: 1
                    },
                    type: {
                        in: [1, 2]
                    }
                }
            }),
            prisma.downloadUrls.count({
                where: {
                    status: {
                        not: 1
                    },
                    type: 3
                }
            })
        ]);

        return {
            data: {
                imageNum,
                videoNum
            },
            code: 200
        }
    } catch (error) {
        return {
            msg: `error: ${error}`,
            code: 500
        }
    }
}

export async function updateCrawlStatsStatus(batchNum: string): Promise<DataResponse<boolean>> {
    try {
        await prisma.crawlStat.update({
            where: { batchNum },
            data: {
                crawlStatus: 1
            }
        });
        return {
            msg: 'success',
            code: 200
        }
    } catch (error) {
        return {
            msg: `error: ${error}`,
            code: 500
        }
    }
}
