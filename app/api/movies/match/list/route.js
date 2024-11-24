import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import dayjs from "dayjs";

export async function GET(request) {
  const { searchParams } = new URL(request.nextUrl);
  const st = searchParams.get("st");
  try {
    const [movies, movieResources] = await Promise.all([
      prisma.moviesInfo.findMany({ select: { code: true } }),
      prisma.moviesVideoResource.findMany({ select: { movieCode: true } }),
    ]);
    let data = [];
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SCRIPT_BACKEND_ENDPOINT}/getDownloadVideo`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
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

    data = data.sort((a, b) => dayjs(b.createdTime).diff(dayjs(a.createdTime)));

    data.forEach((item) => {
      const itemNameLower = item.name.toLowerCase();
      const matchedCode = Array.from(movieCodes).find((code) =>
        itemNameLower.includes(code)
      );
      item.createdTime = dayjs(item.createdTime).format("YYYY-MM-DD HH:mm:ss");

      if (matchedCode) {
        item.matchCode = matchedCode.toUpperCase();
        item.isMatched = movieResourcesCodes.has(matchedCode.toUpperCase());
        item.isPair = true;
      } else {
        item.isMatched = false;
        item.isPair = false;
      }
    });

    if (st === "is") {
      data = data.filter((item) => item.isPair);
      return NextResponse.json(data, { status: 200 });
    } else if (st === "un") {
      data = data.filter((item) => !item.isPair);
      return NextResponse.json(data, { status: 200 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
