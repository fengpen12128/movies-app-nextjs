'use server'

import { getRedisClient, disconnectRedis } from "@/utils/redisUtils";
import prisma from "@/utils/prisma";
import { OptionGroup } from "../types/crawlerTypes";
import { DataResponse } from "../types/crawlerTypes";

interface MovieTag {
    tagName: string;
}



export async function getTags(): Promise<DataResponse<OptionGroup[]>> {
    let client;
    try {
        client = await getRedisClient();

        const tags = await client.zRangeByScore("movies_admin:searchTag:brandTag", 100, "+inf");
        const yearTags = await client.hKeys("movies_admin:searchTag:year");
        const moviesTag = await prisma.MoviesTag.findMany({
            select: {
                tagName: true,
            },
        });

        const tagNameList = moviesTag.map((x: MovieTag) => x.tagName);

        const optionsList: OptionGroup[] = [
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
        ];

        return { data: optionsList, code: 200 };
    } catch (error) {
        console.error("Error fetching tags:", error);
        return { code: 500, msg: "Failed to fetch tags" };
    } finally {
        if (client) {
            await disconnectRedis();
        }
    }
}
