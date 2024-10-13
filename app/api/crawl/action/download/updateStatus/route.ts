import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

interface UpdateStatusRequest {
  batchId: string;
  downloadStatus: string;
  downloadSize?: number;
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const { batchId, downloadStatus, downloadSize }: UpdateStatusRequest = await request.json();

    if (!batchId) {
      return NextResponse.json(
        { error: "batchId is required" },
        { status: 400 }
      );
    }

    await prisma.crawlStat.update({
      where: { batchId: batchId },
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
