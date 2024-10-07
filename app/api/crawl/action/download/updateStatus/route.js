import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function PATCH(request) {
  try {
    const { batchId, downloadStatus, downloadSize } = await request.json();

    if (!batchId) {
      return NextResponse.json(
        { error: "batchId are required" },
        { status: 400 }
      );
    }

    await prisma.crawlStat.update({
      where: { batchId: batchId },
      data: {
        downloadStatus: downloadStatus,
        downloadSize: downloadSize,
      },
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Error updating crawl stat:", error);
    return NextResponse.json(
      { error: "Failed to update crawl stat" },
      { status: 500 }
    );
  }
}
