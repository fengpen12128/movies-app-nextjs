import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const processStats = await fetch(
      `${process.env.CRAWLER_SERVER}/download-statistics`
    );
    const data = await processStats.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ msg: "batchId is empty" }, { status: 500 });
  }
}
