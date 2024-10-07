import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const crawlParams = await request.json();

    const response = await fetch(`${process.env.CRAWLER_SERVER}/run-spider`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(crawlParams),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error starting spider:", error);
    return NextResponse.json(
      { error: "Failed to start spider" },
      { status: 500 }
    );
  }
}
