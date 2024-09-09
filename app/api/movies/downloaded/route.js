import prisma from "@/app/lib/prisma";

export const GET = async (req) => {
  try {
    const downloadedMovies = await prisma.MoviesVideoResource.findMany();

    const formattedMovies = downloadedMovies.map((movie) => ({
      id: movie.id,
      title: `${movie.movieCode}`,
      fileName: movie.path.split('/').pop(),
      filePath: movie.path,
      size: movie.size,
      downloadDate: movie.createdTime,
    }));

    return Response.json(formattedMovies, { status: 200 });
  } catch (error) {
    console.error("Error fetching downloaded movies:", error);
    return Response.json(
      { error: "Failed to load downloaded movies" },
      { status: 500 }
    );
  }
};
