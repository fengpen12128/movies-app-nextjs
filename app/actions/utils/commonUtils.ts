import prisma from "@/app/lib/prisma";

export const DEFAULT_PAGE_SIZE = 50;

export const getCollectionAndDownloadCode = async (): Promise<{ ctCode: string[], dmCode: string[] }> => {
    const [downloadMovies, collectedMovies] = await Promise.all([
        prisma.moviesVideoResource.findMany({ select: { movieCode: true } }),
        prisma.moviesCollection.findMany({ select: { movieCode: true } }),
    ]);

    const ctCode = collectedMovies.map((item) => item.movieCode).filter((item): item is string => item !== null);
    const dmCode = downloadMovies.map((item) => item.movieCode).filter((item): item is string => item !== null);

    return { ctCode, dmCode };
};


export const groupByActress = (arr: Movie[], key: keyof Movie) => {
    return arr.reduce<Record<string, Movie[]>>((result, item) => {
        const categories = item[key];
        if (Array.isArray(categories)) {
            categories.forEach((category) => {
                if (typeof category === 'string') {
                    if (!result[category]) {
                        result[category] = [];
                    }
                    result[category].push(item);
                }
            });
        }
        return result;
    }, {});
};

export const createStack = (collectionMovies: Movie[]) => {
    // 提取actresses数量大于2 的不参与stack
    let multiActresses = collectionMovies
        .filter((x) => x.actresses && x.actresses.length > 2)
        .map((x) => ({
            actress: "",
            movies: [x],
        }));

    collectionMovies = collectionMovies.filter((x) => x.actresses && x.actresses.length <= 2);

    const groupedData = groupByActress(collectionMovies, "actresses");

    // stack 中的movies 收藏时间排序
    let p = Object.keys(groupedData).map((x) => ({
        actress: x,
        movies:
            groupedData[x].length > 1
                ? groupedData[x].sort(
                    (a, b) => {
                        const dateA = a.collectedTime ? new Date(a.collectedTime).getTime() : 0;
                        const dateB = b.collectedTime ? new Date(b.collectedTime).getTime() : 0;
                        return dateB - dateA;
                    }
                )
                : groupedData[x],
    }));

    // 将 单个movies 也转化成数组形式
    let single = p
        .filter((x) => x.movies.length === 1)
        .map((x) => x.movies[0])
        .filter(
            (movie, index, self) =>
                index === self.findIndex((t) => t.code === movie.code)
        )
        .map((x) => ({
            actress: "",
            movies: [x],
        }));

    // 合并
    let result = [
        ...single,
        ...p.filter((x) => x.movies.length > 1),
        ...multiActresses,
    ].sort((a, b) => {
        const dateA = a.movies[0].collectedTime ? new Date(a.movies[0].collectedTime).getTime() : 0;
        const dateB = b.movies[0].collectedTime ? new Date(b.movies[0].collectedTime).getTime() : 0;
        return dateB - dateA;
    });

    return result;
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
            result.coverUrl = process.env.NEXT_PUBLIC_DEMO_IMAGE;
            result.code = result.code.split("-")[1];
        }
        return result;
    };

    if (Array.isArray(movieInput)) {
        return movieInput.map(processMovie);
    } else {
        return processMovie(movieInput);
    }
}
