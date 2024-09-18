import prisma from "@/utils/prisma";

export const GET = async (req, { params }) => {
  const { code } = params;

  try {
    // Check if the movie is already collected
    const existingCollection = await prisma.moviesCollection.findUnique({
      where: {
        movieCode: code,
      },
    });

    if (existingCollection) {
      await prisma.moviesCollection.delete({
        where: {
          movieCode: code,
        },
      });

      return new Response(JSON.stringify({ message: "取消收藏成功" }), {
        status: 200,
      });
    }

    // If not collected, add to collection
    await prisma.moviesCollection.create({
      data: {
        movieCode: code,
      },
    });

    return new Response(JSON.stringify({ message: "收藏成功" }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error collecting movie:", error);
    return new Response(JSON.stringify({ message: "收藏失败" }), {
      status: 500,
    });
  }
};
