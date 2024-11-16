import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

interface UpdateStatusRequest {
  batchNum: string;
  downloadStatus: string;
  downloadSize?: number;
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const { batchNum, downloadStatus, downloadSize }: UpdateStatusRequest = await request.json();

    if (!batchNum) {
      return NextResponse.json(
        { error: "batchNum is required" },
        { status: 400 }
      );
    }

    await prisma.crawlStat.update({
      where: { batchNum: batchNum },
      data: {
        downloadStatus: parseInt(downloadStatus),
        downloadSize: downloadSize?.toString() ?? null,
      },
    });

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Error updating crawl stat:", error);
    return NextResponse.json(
      { error: "Failed to update crawl stat" },
      { status: 500 }
    );
  }
}
