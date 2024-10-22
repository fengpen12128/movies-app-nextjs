'use server'

import { getRedisClient, disconnectRedis } from "@/lib/redisUtils";
import prisma from "@/app/lib/prisma";
import { cookies } from 'next/headers';

export async function getTags(): Promise<DataResponse<OptionGroup[]>> {
    let client;
    try {

        const cookieStore = cookies();
        const config: GlobalSettingsConfig = JSON.parse(cookieStore.get('config')?.value || '{}');
        if (process.env.DEMO_ENV == 'true' || config?.displayMode === 'demo') {
            return {
                code: 200,
                data: [
                    {
                        title: "Categories",
                        options: ["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Thriller"],
                    },
                    {
                        title: "Years",
                        options: ["2023", "2022", "2021", "2020", "2019", "2018", "2017"],
                    },
                    {
                        title: "Tags",
                        options: ["4K", "HDR", "Subtitled", "Dubbed", "Extended Cut", "Director's Cut", "IMAX"],
                    }
                ],
            };
        }

        client = await getRedisClient();

        const tags = await client.zRangeByScore("movies_admin:searchTag:brandTag", 100, "+inf");
        const yearTags = await client.hKeys("movies_admin:searchTag:year");
        const moviesTag = await prisma.moviesTag.findMany({
            select: {
                tagName: true,
            },
        });
        const tagNameList = moviesTag.map((x: any) => x.tagName);
        const optionsList: OptionGroup[] = [
            {
                title: "Prefix",
                options: tags.reverse(),
            },
            {
                title: "Years",
                options: yearTags.sort().reverse(),
            },
            {
                title: "Tags",
                options: tagNameList,
            }
        ];

        return { data: optionsList, code: 200 };
    } catch (error) {
        console.error("Error fetching tags:", error);
        return { code: 500, msg: "Failed to fetch tags" };
    } finally {
        // if (client) {
        //     await disconnectRedis();
        // }
    }
}
