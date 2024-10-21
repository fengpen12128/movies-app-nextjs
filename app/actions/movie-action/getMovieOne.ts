"use server";

import prisma from "@/app/lib/prisma";
import {
    getCollectionAndDownloadCode,
    handleMovie,
} from "@/app/actions/utils/commonUtils";
import { cookies } from 'next/headers';
import { movieSelect } from "../querySelect";
import { saveBrowerHistory } from "./saveBrowerHistory";
import { testMovieData, actorNames } from "../data";

export async function getMovieOne(movieId: number): Promise<DataResponse<Movie>> {
    try {
        const cookieStore = cookies();
        const config: GlobalSettingsConfig = JSON.parse(cookieStore.get('config')?.value || '{}');

        if (process.env.DEMO_ENV == 'true' || config.displayMode === 'demo') {

            const testData = testMovieData[Math.floor(Math.random() * testMovieData.length)]
            testData.actresses = [{
                id: Math.floor(Math.random() * 1000) + 1,
                actressName: actorNames[Math.floor(Math.random() * actorNames.length)]
            }]
            return {
                code: 200,
                data: testData,
            }
        }


        const movie = await prisma.moviesInfo.findUnique({
            where: {
                id: movieId,
            },
            select: movieSelect,
        });

        if (!movie) {
            return {
                code: 500,
                msg: "Movie not found",
            };
        }

        const { ctCode, dmCode } = await getCollectionAndDownloadCode();
        const handled = handleMovie(movie, {
            ctCode,
            dmCode,
        });

        // 异步保存浏览历史，不等待结果
        if (movie.code) {
            Promise.allSettled([saveBrowerHistory(movie.code)])
                .catch(error => console.error("Error saving browser history:", error));
        }

        return {
            code: 200,
            data: handled as Movie,
        }

    } catch (error) {
        console.error("Error fetching movie:", error);
        return {
            code: 500,
            msg: "Error fetching movie",
        }
    }
}
