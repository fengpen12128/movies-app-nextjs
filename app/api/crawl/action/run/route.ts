import { NextRequest, NextResponse } from "next/server";

interface CrawlParams {
  // 定义爬虫参数的接口，根据实际需求调整
  [key: string]: any;
}

interface CrawlResponse {
  jobId: string;
  batchNum: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<CrawlResponse | { error: string }>> {
  try {
    const crawlParams: CrawlParams = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_SCRIPT_BACKEND_ENDPOINT}/run-spider`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(crawlParams),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CrawlResponse = await response.json();

    // 确保返回的数据包含 jobId 和 batchNum
    if (!data.jobId || !data.batchNum) {
      throw new Error("Invalid response from crawler server");
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error starting spider:", error);
    return NextResponse.json(
      { error: "Failed to start spider" },
      { status: 500 }
    );
  }
}
