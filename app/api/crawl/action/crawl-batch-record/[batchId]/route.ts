import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { NextRequest } from "next/server";
import { CrawlSourceData } from "@prisma/client";

interface Params {
    batchNum: string;
}



export async function GET(request: NextRequest, { params }: { params: Params }) {
    const { batchNum } = params;

    try {
        // Query crawlSourceData for the current batch
        const sourceData: CrawlSourceData[] = await prisma.crawlSourceData.findMany({
            where: { batchNum: batchNum },
        });

        // Insert data into CrawlBatchRecord
        await prisma.crawlBatchRecord.createMany({
            data: sourceData.map((item: CrawlSourceData) => ({
                batchNum: batchNum,
                code: item.code ?? '',
                type: item.updatedTime ? 2 : 1, // 1 for new, 2 for update
            })),
            skipDuplicates: true, // This will skip any duplicates based on unique constraints
        });

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error("Error processing crawl batch record:", error);
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}
