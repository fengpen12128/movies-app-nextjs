import { NextResponse } from "next/server";
import { ProcessStats } from "@/app/types/crawlerTypes";

export async function GET(req: Request) {
  try {
    const response = await fetch(
      `${process.env.CRAWLER_SERVER}/download-statistics`
    );
    const data: ProcessStats = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ msg: "An error occurred while fetching download statistics" }, { status: 500 });
  }
}
