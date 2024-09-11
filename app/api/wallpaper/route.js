import { getMinioFiles } from "@/utils/minioTools";
import prisma from "@/app/lib/prisma";
export const GET = async (req) => {
  try {
    const allFiles = await getMinioFiles();
    const randomFiles = allFiles.sort(() => 0.5 - Math.random()).slice(0, 50);
    return Response.json({ wallpapers: randomFiles }, { status: 200 });
  } catch (error) {
    console.error("Error fetching wallpapers:", error);
    return new Response("Failed to load wallpapers", { status: 500 });
  }
};
