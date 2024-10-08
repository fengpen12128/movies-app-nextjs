import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { CrawlParams } from "@/app/types/crawlerTypes";
import { processCrawlParams } from "../utils";

interface RouteParams {
    params: {
        batchId: string;
    };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
    const { batchId } = params;

    try {
        const result = await prisma.crawlStat.findUnique({
            where: { batchId },
            select: { crawlParams: true },
        });

        if (!result) {
            return NextResponse.json({ error: "Batch not found" }, { status: 404 });
        }

        const crawlParams: CrawlParams = await processCrawlParams(result.crawlParams);

        return NextResponse.json({ data: crawlParams }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Request failed" }, { status: 500 });
    }
}
