"use client";

import "react-photo-view/dist/react-photo-view.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { Image } from "@nextui-org/image";
import NextImage from "next/image";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import InfitifyGrid from "./InfitifyGrid";
import { useImageDisplay } from "@/app/hooks/useGlobalSettings";
import { useState, useEffect } from "react";
import { getMedia } from "@/app/actions";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const MoviesPreview = ({ movieId }: { movieId: number }) => {
  const imageDisplay = useImageDisplay();
  const [isLoading, setIsLoading] = useState(false);
  const [media, setMedia] = useState<MoviesMediaUrl | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getMedia(movieId).then((res) => {
      setMedia(res.data || null);
      setIsLoading(false);
    });
  }, [movieId]);

  if (isLoading) return <>Loading...</>;

  if (!media) return <>Media Not Found </>;

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

export default MoviesPreview;
