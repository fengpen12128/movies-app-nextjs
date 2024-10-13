"use server";

import prisma from "@/app/lib/prisma";
import {
    getCollectionAndDownloadCode,
    handleMovie,
} from "@/app/actions/utils/commonUtils";
import { cookies } from 'next/headers';
import { movieSelect } from "../querySelect";


export async function getMovieOne(movieId: number): Promise<DataResponse<Movie>> {

    try {
        const cookieStore = cookies();
        const config: GlobalSettingsConfig = JSON.parse(cookieStore.get('config')?.value || '{}');

        const movie = await prisma.moviesInfo.findUnique({
            where: {
                id: movieId,
            },
            select: movieSelect,
        });

        if (!movie) {
            return {
                code: 500,
                msg: "Movie not found"
            };
        }
        const { ctCode, dmCode } = await getCollectionAndDownloadCode();
        const handled = handleMovie(movie, {
            ctCode,
            dmCode,
        }, config);
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
