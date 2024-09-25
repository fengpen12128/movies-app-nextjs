import { updateCrawlInfo, getCrawlInfo } from "@/app/actions/crawlAction";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { id } = await req.json();
  await updateCrawlInfo(id);
  return NextResponse.json({ message: "ok" });
}

export async function GET(req) {
  const crawlInfo = await getCrawlInfo();
  return NextResponse.json(crawlInfo);
}
