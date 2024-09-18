import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";
import dayjs from "dayjs";

export async function POST(req) {
  const { actressName, page = 1, limit = 50 } = await req.json();
  const skip = (page - 1) * limit;

  let q = {
    where: {
      actresses: {
        some: {
          actressName: {
            in: [actressName],
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
    skip,
    take: limit,
    orderBy: {
      releaseDate: "desc",
    },
  };
  try {
    const [actressRel, totalCount] = await Promise.all([
      prisma.MoviesInfo.findMany(q),
      prisma.MoviesInfo.count({ where: q.where }),
    ]);

    const formattedActressRel = actressRel.map((movie) => ({
      id: movie.id,
      code: movie.code,
      releaseDate: dayjs(movie.releaseDate).format("YYYY-MM-DD"),
      rate: movie.rate,
      rateNum: movie.rateNum,
      coverUrl: movie.files[0]?.path || "",
    }));

    return NextResponse.json(
      {
        pagination: {
          totalCount,
          current: page,
          pageSize: limit,
          totalPage: Math.ceil(totalCount / limit),
        },
        movies: formattedActressRel,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching actress related movies:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
