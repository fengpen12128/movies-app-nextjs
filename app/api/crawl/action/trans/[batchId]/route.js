import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { batchId } = params;

  if (!batchId) {
    return NextResponse.json({ msg: "batchId is empty" }, { status: 500 });
  }

  try {
    const movieDataArray = await getMovieDataFromPostgres(batchId);
    console.log("margined num : ", movieDataArray.length);
    for (const movieData of movieDataArray) {
      await insertMovieData(movieData);
    }
    return NextResponse.json(
      { msg: "trans completed", count: movieDataArray.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

async function getMovieDataFromPostgres(batchId) {
  try {
    const movieData = await prisma.crawlSourceData.findMany({
      select: {
        data: true,
      },
      where: {
        batchId: batchId,
      },
    });
    return movieData.map((item) => item.data);
  } catch (error) {
    console.error("Error fetching data from Postgres:", error);
    return [];
  }
}

function getUrlBasename(code, url) {
  try {
    const basename = url.split("/").pop();
    return `${code}/${basename}`;
  } catch (error) {
    console.error("Invalid URL:", error.message);
    return "";
  }
}

async function insertMovieData(movie) {
  // 如果MoviesInfo存在，先删除
  await prisma.moviesInfo.deleteMany({
    where: { code: movie.code },
  });

  // 插入MoviesInfo
  const newMovie = await prisma.moviesInfo.create({
    data: {
      code: movie.code,
      prefix: movie.code.split("-")[0],
      duration: movie.duration,
      rate: parseFloat(movie.score),
      rateNum: parseInt(movie.voters),
      releaseDate: new Date(movie.release_date),
      releaseYear: new Date(movie.release_date).getFullYear(),
      crawlWebsite: movie.crawl_website,
      crawlUrl: movie.crawl_url,
      batchNum: movie.batch_id,
      updatedTime: new Date(),
      actresses: {
        connectOrCreate: movie.actress?.map((name) => ({
          where: { actressName: name },
          create: { actressName: name },
        })),
      },
      files: {
        create: movie.media_urls?.map((media) => ({
          path: getUrlBasename(movie.code, media.url),
          type: media.type,
          onlineUrl: media.url,
        })),
      },
      magnetLinks: {
        create: movie.links?.map((link) => ({
          linkUrl: link.magnet_link,
          size: link.size,
          uploadTime: link.upload,
        })),
      },
      tags: {
        connectOrCreate: movie.tags?.map((tag) => ({
          where: { tagName: tag },
          create: { tagName: tag },
        })),
      },
    },
  });

  console.log(`Inserted movie: ${newMovie.code}`);
}
