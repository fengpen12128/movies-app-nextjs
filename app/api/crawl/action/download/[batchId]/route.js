import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { batchId } = params;
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode") || "async";

  if (!batchId) {
    return NextResponse.json({ msg: "batchId is empty" }, { status: 500 });
  }

  try {
    const url =
      mode === "async"
        ? `${process.env.CRAWLER_SERVER}/start-download-async`
        : `${process.env.CRAWLER_SERVER}/start-download-sync`;


    const taskInfo = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ batchId }),
    });
    return NextResponse.json(taskInfo, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { msg: "Error occurred during download", error: error.message },
      { status: 500 }
    );
  }
}
