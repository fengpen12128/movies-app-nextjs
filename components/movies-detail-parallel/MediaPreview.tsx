"use client";

import "react-photo-view/dist/react-photo-view.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { Image } from "@nextui-org/image";
import NextImage from "next/image";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import InfitifyGrid from "./InfitifyGrid";
import { useImageDisplay } from "@/app/hooks/useGlobalSettings";
import { useQuery } from "@tanstack/react-query";
import { getMedia } from "@/app/actions";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const MediaPreview = ({ movieId }: { movieId: number }) => {
  const imageDisplay = useImageDisplay();

  const { data: media, isLoading: isLoadingMedia } = useQuery({
    queryKey: ["media", movieId],
    queryFn: async () => {
      const res = await getMedia(movieId);
      return res.data || null;
    },
    enabled: !!movieId, // 确保只有在 movieId 存在时才执行查询
  });

  if (isLoadingMedia) return <>Loading...</>;

  if (!media) return <>Media Not Found</>;

  if (imageDisplay === "MasonryGrid") {
    return (
      <InfitifyGrid
        introUrls={media?.introUrls.map((x) => x.path) || []}
        videoUrl={media?.videoUrl || ""}
        coverUrl={media?.coverUrl || ""}
      />
    );
  }

  return (
    <div className="w-full rounded grid grid-cols-2 sm:grid-cols-4 gap-2 p-2">
      <HeroVideoDialog
        animationStyle="from-center"
        videoSrc={media?.videoUrl || ""}
        thumbnailSrc={media?.coverUrl || ""}
        thumbnailAlt="Hero Video"
      />
      <PhotoProvider loop maskOpacity={0.5}>
        {media?.introUrls.map((x) => (
          <PhotoView key={x.id} src={x.path}>
            <Image
              as={NextImage}
              width={272}
              height={200}
              loading="eager"
              priority
              className="cursor-pointer object-cover"
              isBlurred
              alt="preview"
              src={x.path}
            />
          </PhotoView>
        ))}
      </PhotoProvider>
    </div>
  );
};

export default MediaPreview;
