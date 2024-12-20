import prisma from "@/app/lib/prisma";

export const GET = async (req, { params }) => {
  const { code } = params;

  try {
    const movie = await prisma.MoviesInfo.findUnique({
      where: {
        id: Number(code),
      },
      include: {
        actresses: true,
        magnetLinks: true,
        files: true,
        tags: true,
      },
    });

    if (!movie) {
      return new Response(JSON.stringify({ error: "Movie not found" }), {
        status: 404,
      });
    }

    const collected = await prisma.moviesCollection.findUnique({
      where: {
        movieCode: movie.code,
      },
    });

    const videoResource = await prisma.moviesVideoResource.findMany({
      where: {
        movieCode: movie.code,
      },
    });

    movie.coverUrl = movie.files.find((file) => file.type === 2)?.path;
    movie.files = movie.files.map((file) => ({
      ...file,
      onlineUrl:
        file.onlineUrl && !file.onlineUrl.startsWith("http")
          ? `https:${file.onlineUrl}`
          : file.onlineUrl,
    }));
    movie.releaseDate = movie.releaseDate.toLocaleDateString();
    movie.collected = collected ? true : false;
    movie.videoResource = videoResource;
    return Response.json(movie, { status: 200 });
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return Response.json(
      { error: "Failed to fetch movie details" },
      { status: 500 }
    );
  }
};
