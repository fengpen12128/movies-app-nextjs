import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [movies, movieResources] = await Promise.all([
      prisma.MoviesInfo.findMany({ select: { code: true } }),
      prisma.MoviesVideoResource.findMany({ select: { movieCode: true } }),
    ]);
    let data;
    try {
      const response = await fetch(
        "http://192.168.1.22:9101/getDownloadVideo",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // 如果需要认证，添加相应的头部
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      data = await response.json();
    } catch (fetchError) {
      console.error("Error fetching video data:", fetchError);
      // 可以选择继续执行，或者抛出错误
    }
    const movieCodes = new Set(movies.map((movie) => movie.code.toLowerCase()));
    const movieResourcesCodes = new Set(
      movieResources.map((movie) => movie.movieCode)
    );

    data.forEach((item) => {
      const itemNameLower = item.name.toLowerCase();
      const matchedCode = Array.from(movieCodes).find((code) =>
        itemNameLower.includes(code)
      );

      if (matchedCode) {
        item.matchCode = matchedCode.toUpperCase();
        item.isMatched = movieResourcesCodes.has(matchedCode.toUpperCase());
        item.isPair = true;
      } else {
        item.isMatched = false;
        item.isPair = false;
      }
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error:error }, { status: 500 });
  }
}
