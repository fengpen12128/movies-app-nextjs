import { list } from "@vercel/blob";

export async function GET() {
  const response = await list();
  const allImages = response.blobs.map((blob) => blob.downloadUrl);
  return Response.json({ wallpapers: allImages }, { status: 200 });
}
