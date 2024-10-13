"use client";

import "react-photo-view/dist/react-photo-view.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { useState } from "react";
import dynamic from "next/dynamic";
import RenderPortal from "@/components/RenderPortal";
import { message } from "react-message-popup";
import { useMediaUrls } from "@/app/hooks/useMedia";
import useMobile from "@/app/hooks/useMobile";
import { Image } from "@nextui-org/image";
import NextImage from "next/image";
import { Play } from "lucide-react";

// 动态导入 VideoPlayer 组件
const VideoPlayer = dynamic(() => import("@/components/VideoPlayer"), {
  ssr: false, // 禁用服务器端渲染
});

interface MoviesPreviewProps {
  media: MovieMedia[];
}

const MoviesPreview: React.FC<MoviesPreviewProps> = ({ media }) => {
  const isMobile = useMobile();
  const [showPlay, setShowPlay] = useState<boolean>(false);

  const { videoUrl, coverUrl, introUrls } = useMediaUrls(media);

  const handlePlayVideo = async () => {
    if (!videoUrl) {
      message.error("无预览视频 ");
      return;
    }
    setShowPlay(true);
  };

  return (
    <div className="w-full rounded grid grid-cols-2 sm:grid-cols-4 gap-2  p-2">
      <div className="relative">
        <img
          className="cursor-pointer h-[200px] object-cover"
          src={coverUrl}
          alt=""
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
          <span
            onClick={handlePlayVideo}
            className="text-white cursor-pointer text-5xl"
          >
            <Play color="#FFB6C1" fill="#FFB6C1" size={60} />
          </span>
        </div>
      </div>

      <PhotoProvider loop maskOpacity={0.5}>
        {introUrls.map((x) => (
          <PhotoView key={x.id} src={x.path}>
            {/* <img
              style={{ objectFit: "cover" }}
              className="h-[200px] w-full  cursor-pointer"
              src={x.path}
            /> */}
            <Image
              as={NextImage}
              width={272}
              height={200}
              loading="eager"
              priority
              style={{ maxHeight: "200px", width: "auto" }}
              className="cursor-pointer object-cover"
              isBlurred
              alt="preview"
              src={x.path}
            />
          </PhotoView>
        ))}
      </PhotoProvider>
      {showPlay && (
        <RenderPortal>
          <div
            onClick={() => setShowPlay(false)}
            className="fixed inset-0 bg-black bg-opacity-50 bg h-screen w-screen flex items-center justify-center z-[9999]"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`flex items-center justify-center rounded-lg shadow-xl w-[70%]`}
            >
              <VideoPlayer src={videoUrl || ""} />
            </div>
          </div>
        </RenderPortal>
      )}
    </div>
  );
};

export default MoviesPreview;
