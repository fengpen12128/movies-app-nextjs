import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { batchNum } = params;
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode") || "async";

  if (!batchNum) {
    return NextResponse.json({ msg: "batchNum is empty" }, { status: 500 });
  }

  try {
    const url =
      mode === "async"
        ? `${process.env.NEXT_PUBLIC_SCRIPT_BACKEND_ENDPOINT}/start-download-async`
        : `${process.env.NEXT_PUBLIC_SCRIPT_BACKEND_ENDPOINT}/start-download-sync`;

    const taskInfo = await fetch(url, {
      method: "get",
    });
    return NextResponse.json(taskInfo, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { msg: "Error occurred during download", error: error.message },
      { status: 500 }
    );
  }
}
