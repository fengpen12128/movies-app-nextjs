"use server";

import prisma from "@/app/lib/prisma";
import {
    getCollectionAndDownloadCode,
    handleMovie
} from "@/app/actions/utils/commonUtils";
import { movieSelect } from "../querySelect";
import { cookies } from 'next/headers';




export async function getActressRelMovies(movieId: number): Promise<DataResponse<Movie[]>> {

    try {

        const cookieStore = cookies();
        const config: GlobalSettingsConfig = JSON.parse(cookieStore.get('config')?.value || '{}');



        const movie = await prisma.moviesInfo.findUnique({
            where: { id: movieId },
            select: {
                actresses: true
            }
        });

        if (!movie) {
            return { code: 500, data: [] };
        }

        if (movie.actresses.length === 0 || movie.actresses.length > 2) {
            return { code: 200, data: [] };
        }

        const actressNames = movie.actresses.map((x: any) => x.actressName);

        const relMovies = await prisma.moviesInfo.findMany({
            where: { actresses: { some: { actressName: { in: actressNames } } } },
            select: movieSelect,
            take: 6
        });
        const filteredRelMovies = relMovies.filter((x: any) => x.id !== movieId);


        // If we removed a movie, fetch one more to maintain 6 movies
        if (filteredRelMovies.length < relMovies.length) {
            const additionalMovie = await prisma.moviesInfo.findFirst({
                where: {
                    actresses: { some: { actressName: { in: actressNames } } },
                    NOT: { id: movieId },
                    id: { notIn: filteredRelMovies.map((m: any) => m.id) }
                },
                select: movieSelect
            });

            if (additionalMovie) {
                filteredRelMovies.push(additionalMovie);
            }
        }
        const { ctCode, dmCode } = await getCollectionAndDownloadCode();

        const handled = handleMovie(filteredRelMovies, {
            ctCode,
            dmCode,
        }, config);



        return {
            code: 200,
            data: handled as Movie[] || []
        }

    } catch (error) {
        console.error("Error fetching actress rel movies:", error);
        return { code: 500, msg: "Error fetching actress rel movies", data: [] };
    }

}
