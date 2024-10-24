import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { actressName = [] } = await req.json();

  let q = {
    where: {
      actresses: {
        some: {
          actressName: {
            in: actressName,
          },
        },
      },
    },
    select: {
      id: true,
      code: true,
      releaseDate: true,
      rate: true,
      rateNum: true,
      files: {
        where: {
          type: 2,
        },
        select: {
          path: true,
        },
      },
    },
    take: 9,
    orderBy: {
      releaseDate: "desc",
    },
  };
  try {
    const actressRel = await prisma.MoviesInfo.findMany(q);
    const formattedActressRel = actressRel.map((movie) => ({
      id: movie.id,
      code: movie.code,
      releaseDate: movie.releaseDate,
      rate: movie.rate,
      rateNum: movie.rateNum,
      coverUrl: movie.files[0]?.path || "",
    }));

    return NextResponse.json(formattedActressRel, { status: 200 });
  } catch (error) {
    console.error("Error fetching actress related movies:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
