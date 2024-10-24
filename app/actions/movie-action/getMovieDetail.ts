'use server';

import { getMovieOne } from "./getMovieOne";
import { getMagnetLinks } from "./getMagnetLinks";
import { getVideoResource } from "@/app/actions";
import { getMedia } from "./getMedia";
import { getActressRelMovies } from "./getActressRelMovies";

export async function getMovieDetail(movieId: number): Promise<DataResponse<MoviesDetail>> {
    try {
        const [moviesResult, magnetLinksResult, videoResourcesResult, mediaResult, relationMoviesResult] = await Promise.allSettled([
            getMovieOne(movieId),
            getMagnetLinks(movieId),
            getVideoResource(movieId),
            getMedia(movieId),
            getActressRelMovies(movieId)
        ]);

        if (moviesResult.status !== 'fulfilled' || !moviesResult.value.data) {
            return {
                code: 500,
                msg: `Not Movies Found of ${movieId}`
            }
        }

        return {
            code: 200,
            data: {
                movie: moviesResult.value.data,
                magnetLinks: magnetLinksResult.status === 'fulfilled' ? magnetLinksResult.value.data ?? [] : [],
                videoResources: videoResourcesResult.status === 'fulfilled' ? videoResourcesResult.value.data ?? [] : [],
                media: mediaResult.status === 'fulfilled' ? mediaResult.value.data ?? null : null,
                relationMovies: relationMoviesResult.status === 'fulfilled' ? relationMoviesResult.value.data ?? [] : [],
            }
        };
    } catch (error) {
        console.error('Error in getMovieDetail:', error);
        return {
            code: 500,
            msg: `Fail fetch Movie of ${movieId}`
        }
    }
}
