import prisma from "@/app/lib/prisma";

export const DEFAULT_PAGE_SIZE = 50;
import { movieNames, actorNames } from "./data";


export const getCollectionAndDownloadCode = async (): Promise<{ ctCode: string[], dmCode: string[] }> => {
    const [downloadMovies, collectedMovies] = await Promise.all([
        prisma.moviesVideoResource.findMany({ select: { movieCode: true } }),
        prisma.moviesCollection.findMany({ select: { movieCode: true } }),
    ]);

    const ctCode = collectedMovies.map((item) => item.movieCode).filter((item): item is string => item !== null);
    const dmCode = downloadMovies.map((item) => item.movieCode).filter((item): item is string => item !== null);

    return { ctCode, dmCode };
};

export function getPaginationData(totalCount: number, page: number, limit: number): PaginationData {
    return {
        totalCount,
        current: page,
        pageSize: limit,
        totalPage: Math.ceil(totalCount / limit),
    };
}

interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
}

export function parsePaginationParams(searchParams: URLSearchParams): PaginationParams {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "30", 10);
    const skip = (page - 1) * limit;
    return { page, limit, skip };
}

export const handleMovie = (
    movieInput: any,
    options?: {
        ctCode?: string[];
        dmCode?: string[];
    },
    config?: GlobalSettingsConfig
): Movie | Movie[] => {
    const processMovie = (movie: any): Movie => {

        const collected = options?.ctCode ? options.ctCode.includes(movie.code) : false;
        const downloaded = options?.dmCode ? options.dmCode.includes(movie.code) : false;

        let result = {
            ...movie,
            coverUrl: movie.files && movie.files[0] ? `${process.env.MINIO_PATH}/${movie.files[0].path}` : '',
            rate: movie.rate ? parseFloat(movie.rate) : 0,
            collected,
            downloaded,
        };


        if (config?.displayMode === 'demo') {
            result.coverUrl = `/demo/demo${Math.floor(Math.random() * 30) + 1}.jpg`
            result.code = movieNames[Math.floor(Math.random() * movieNames.length)]
            result.actresses = [actorNames[Math.floor(Math.random() * actorNames.length)]]
        }
        return result;
    };

    if (Array.isArray(movieInput)) {
        return movieInput.map(processMovie);
    } else {
        return processMovie(movieInput);
    }
}
