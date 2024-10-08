import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";

interface UpdateTransStatusRequest {
  batchId: string;
  transStatus: string;
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const { batchId, transStatus }: UpdateTransStatusRequest = await request.json();

    if (!batchId || transStatus === undefined) {
      return NextResponse.json(
        { error: "batchId and transStatus are required" },
        { status: 400 }
      );
    }

    // 使用 Promise.all 并行查询新增数和更新数
    const [newCount, updateCount] = await Promise.all([
      prisma.crawlSourceData.count({
        where: {
          batchId: batchId,
          updatedTime: null,
        },
      }),
      prisma.crawlSourceData.count({
        where: {
          batchId: batchId,
          updatedTime: {
            not: null,
          },
        },
      }),
    ]);

    const updatedCrawlStat = await prisma.crawlStat.update({
      where: { batchId: batchId },
      data: {
        transStatus: transStatus,
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
