import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { insertMovieData } from "../utils";

interface RouteParams {
  params: {
    batchNum: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { batchNum } = params;

  if (!batchNum) {
    return NextResponse.json({ msg: "batchNum is empty" }, { status: 500 });
  }

  try {
    const movieDataArray = await prisma.crawlSourceData.findMany({
      select: { data: true },
      where: { batchNum: batchNum },
    });

    console.log("margined num : ", movieDataArray.length);

    for (const movieData of movieDataArray) {
      await insertMovieData(movieData.data);
    }

    return NextResponse.json(
      { msg: "trans completed", count: movieDataArray.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
