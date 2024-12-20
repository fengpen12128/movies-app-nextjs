import prisma from "@/app/lib/prisma";

export function getUrlBasename(code: string, url: string) {
    try {
        const basename = url.split("/").pop();
        return `${code}/${basename}`;
    } catch (error) {
        console.error("Invalid URL:", error);
        return "";
    }
}

export async function insertMovieData(movie: any) {
    try {
        const movieData = {
            prefix: movie.code.split("-")[0],
            maker: movie?.maker,
            duration: String(movie.duration),
            rate: parseFloat(movie.score),
            rateNum: parseInt(movie.voters),
            releaseDate: new Date(movie.release_date),
            releaseYear: new Date(movie.release_date).getFullYear(),
            crawlWebsite: movie.crawl_website,
            crawlUrl: movie.crawl_url,
            batchNum: movie.batch_num,
            updatedTime: movie.updated_time ? new Date(movie.updated_time) : null,
            createdTime: movie.created_time ? new Date(movie.created_time) : new Date(),
            actresses: {
                connectOrCreate: movie.actress?.map((name: string) => ({
                    where: { actressName: name },
                    create: { actressName: name },
                })),
            },
            files: {
                create: movie.media_urls?.map((media: any) => ({
                    path: getUrlBasename(movie.code, media.url),
                    type: media.type,
                    onlineUrl: media.url,
                })),
            },
            magnetLinks: {
                create: movie.links?.map((link: any) => ({
                    linkUrl: link.magnet_link,
                    size: link.size,
                    uploadTime: link.upload,
                })),
            },
            tags: {
                connectOrCreate: movie.tags?.map((tag: string) => ({
                    where: { tagName: tag },
                    create: { tagName: tag },
                })),
            },
        };

        const existingMovie = await prisma.moviesInfo.findUnique({
            where: { code: movie.code },
        });

        if (existingMovie) {
            const updatedMovie = await prisma.moviesInfo.update({
                where: { code: movie.code },
                data: {
                    ...movieData,
                    files: {
                        deleteMany: {},
                        ...movieData.files,
                    },
                    magnetLinks: {
                        deleteMany: {},
                        ...movieData.magnetLinks,
                    },
                },
            });
            console.log(`Updated movie: ${updatedMovie.code}`);
        } else {
            const newMovie = await prisma.moviesInfo.create({
                data: {
                    code: movie.code,
                    ...movieData,
                },
            });
            console.log(`Inserted new movie: ${newMovie.code}`);
        }
    } catch (error) {
        console.error(`Error inserting/updating movie data for code ${movie.code}:`, error);
        throw error;
    }
}
