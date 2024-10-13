import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getPaginationData, parsePaginationParams } from "@/app/api/utils";
import { processCrawlParams } from "./utils";

export async function GET(req: NextRequest): Promise<NextResponse<CrawlStatResponse | { error: string }>> {
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = parsePaginationParams(searchParams);

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
                const processedParams = await processCrawlParams(stat.crawlParams);
                return {
                    ...stat,
                    status: processedParams.status,
                    urls: processedParams.urls,
                    jobId: processedParams.jobId,
                };
            })
        );

        const response: CrawlStatResponse = {
            data: processedCrawlParams,
            pagination: getPaginationData(count, page, limit),
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Database query error:", error);
        return NextResponse.json(
            { error: "Database query failed" },
            { status: 500 }
        );
    }
}
