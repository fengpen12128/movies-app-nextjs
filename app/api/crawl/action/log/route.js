import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${process.env.CRAWLER_SERVER}/spider-log/${jobId}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("Error fetching spider log:", error);
    return NextResponse.json(
      { error: "Failed to fetch spider log" },
      { status: 500 }
    );
  }
}
