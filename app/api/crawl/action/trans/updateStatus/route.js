import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

// ... 其他现有代码 ...

export async function PATCH(request) {
  try {
    const { batchId, transStatus } = await request.json();

    if (!batchId || transStatus === undefined) {
      return NextResponse.json(
        { error: "batchId and transStatus are required" },
        { status: 400 }
      );
    }

    const updatedCrawlStat = await prisma.crawlStat.update({
      where: { batchId: batchId },
      data: { transStatus: transStatus },
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
