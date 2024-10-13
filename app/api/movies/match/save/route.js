import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { matchList } = await req.json();

  try {
    await prisma.MoviesVideoResource.createMany({
      data: matchList.map((item) => ({
        movieCode: item.matchCode,
        path: item.path,
        size: String(item.size),
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({ message: "保存成功" }, { status: 200 });
  } catch (error) {
    console.error("Error saving match results:", error);
    return new Response(JSON.stringify({ error: "保存匹配结果失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
