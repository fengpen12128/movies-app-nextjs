export const getImages = async () => {
  const resp = await fetch("/api/movies/wallpaper", { method: "get" });
  const { wallpapers } = await resp.json();
  return wallpapers;
};
