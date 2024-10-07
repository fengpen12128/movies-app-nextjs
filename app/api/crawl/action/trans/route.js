import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { insertMovieData } from "./utils";

export async function GET(req, { params }) {
  try {
    const movieDataArray = await prisma.crawlSourceData.findMany({
      select: { data: true },
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
