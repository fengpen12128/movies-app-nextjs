"use client";

import "react-photo-view/dist/react-photo-view.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { Image } from "@nextui-org/image";
import NextImage from "next/image";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";

interface MoviesPreviewProps {
  media: MoviesMediaUrl;
}

const MoviesPreview: React.FC<MoviesPreviewProps> = ({ media }) => {
  const { videoUrl, coverUrl, introUrls } = media;

  return (
    <div className="w-full rounded grid grid-cols-2 sm:grid-cols-4 gap-2 p-2">
      <HeroVideoDialog
        animationStyle="from-center"
        videoSrc={videoUrl || ""}
        thumbnailSrc={coverUrl || ""}
        thumbnailAlt="Hero Video"
      />
      <PhotoProvider loop maskOpacity={0.5}>
        {introUrls.map((x) => (
          <PhotoView key={x.id} src={x.path}>
            <Image
              as={NextImage}
              width={272}
              height={200}
              loading="eager"
              priority
              //   style={{ maxHeight: "200px", width: "auto" }}
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
