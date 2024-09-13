import { NextResponse } from "next/server";
import { getRedisClient, disconnectRedis } from "@/utils/redisUtils";
import prisma from "@/utils/prisma";


export async function GET(req, res) {
  let client;
  try {
    client = await getRedisClient();

    const tags = await client.zRange("movies_admin:searchTag:brandTag", 0, -1);
    const yearTags = await client.hKeys("movies_admin:searchTag:year");
    const moviesTag = await prisma.MoviesTag.findMany({
      select: {
        tagName: true,
      },
    });

    let tagNameList = moviesTag.map((x) => x.tagName);

    const optionsList = [];

    optionsList.push(
      {
        title: "prefix",
        options: tags.reverse(),
      },
      {
        title: "years",
        options: yearTags.sort().reverse(),
      },
      {
        title: "tags",
        options: tagNameList,
      }
    );

    return NextResponse.json(optionsList);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  } finally {
    if (client) {
      await disconnectRedis();
    }
  }
}
