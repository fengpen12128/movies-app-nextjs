import { NextRequest, NextResponse } from "next/server";

interface SpiderStatusResponse {
  task_id: string;
  status: "running" | "pending" | "finished" | "not_found";
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${process.env.CRAWLER_SERVER}/spider-status/${jobId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SpiderStatusResponse = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching spider status:", error);
    return NextResponse.json(
      { error: "Failed to fetch spider status" },
      { status: 500 }
    );
  }
}
