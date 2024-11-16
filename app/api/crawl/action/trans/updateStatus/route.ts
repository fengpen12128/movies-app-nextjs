import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

interface UpdateTransStatusRequest {
    batchNum: string;
    transStatus: string;
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
    try {
        const { batchNum, transStatus }: UpdateTransStatusRequest = await request.json();

        if (!batchNum || transStatus === undefined) {
            return NextResponse.json(
                { error: "batchNum and transStatus are required" },
                { status: 400 }
            );
        }

        // 使用 Promise.all 并行查询新增数和更新数
        const [newCount, updateCount] = await Promise.all([
            prisma.crawlSourceData.count({
                where: {
                    batchNum: batchNum,
                    updatedTime: null,
                },
            }),
            prisma.crawlSourceData.count({
                where: {
                    batchNum: batchNum,
                    updatedTime: {
                        not: null,
                    },
                },
            }),
        ]);

        const updatedCrawlStat = await prisma.crawlStat.update({
            where: { batchNum: batchNum },
            data: {
                transStatus: parseInt(transStatus),
                newlyIncreasedNum: newCount,
                updatedNum: updateCount,
            },
        });

        return NextResponse.json(updatedCrawlStat);
    } catch (error) {
        console.error("Error updating crawl stat:", error);
        return NextResponse.json(
            { error: "Failed to update crawl stat" },
            { status: 500 }
        );
    }
}
