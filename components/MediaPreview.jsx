"use client";

import "react-photo-view/dist/react-photo-view.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { useState, useEffect } from "react";
import PortalComponent from "@/components/PortalComponent";
import Xgplayer from "xgplayer-react";
import { nanoid } from "nanoid";
import { useDisplayMode } from "@/hooks/useDisplayMode";

const MoviesPreview = ({ mediaUrls = [] }) => {
  const displayMode = useDisplayMode();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const videoUrl = mediaUrls.find((x) => x.type == 3)?.path;
  const coverUrl = mediaUrls.find((x) => x.type == 2)?.path;
  const introUrls = mediaUrls
    .filter((x) => x.type == 1)
    .map((x) => ({
      id: nanoid(),
      path: x.path,
    }));

  const config = {
    url:
      displayMode === "normal" ? videoUrl : process.env.NEXT_PUBLIC_DEMO_VIDEO,
    loop: true,
    autoplay: true,
    volume: 0,
    poster: "",
    muted: false,
    width: isMobile ? '100%' : 1000,
    height: isMobile ? 'auto' : 750,
  };

  const handlePlayVideo = () => {
    // if (typeof window !== "undefined" && window.innerWidth <= 768) {
    //   window.open(config.url, "_blank");
    // } else {
    //   setShowPlay(true);
    // }

    setShowPlay(true);
  };

  const [showPlay, setShowPlay] = useState(false);

  return (
    <div className="w-full rounded grid grid-cols-2 sm:grid-cols-4 gap-2  p-2">
      <div className="relative">
        <img
          className="cursor-pointer h-[200px] object-cover"
          src={
            displayMode === "normal"
              ? coverUrl
              : process.env.NEXT_PUBLIC_DEMO_IMAGE
          }
          alt=""
        />

        <div className="absolute inset-0 bg-black bg-opacity-50 hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
          <span
            onClick={handlePlayVideo}
            className="text-white cursor-pointer text-5xl"
          >
            ▶
          </span>
        </div>
      </div>

      <PhotoProvider loop maskOpacity={0.5}>
        {introUrls.map((x) => (
          <PhotoView
            key={x.id}
            src={
              displayMode === "normal"
                ? x.path
                : process.env.NEXT_PUBLIC_DEMO_IMAGE
            }
          >
            <img
              style={{ objectFit: "cover" }}
              className="h-[200px] w-full  cursor-pointer"
              src={
                displayMode === "normal"
                  ? x.path
                  : process.env.NEXT_PUBLIC_DEMO_IMAGE
              }
            />
          </PhotoView>
        ))}
      </PhotoProvider>

      {showPlay && (
        <PortalComponent>
          <div
            onClick={() => setShowPlay(false)}
            className="fixed inset-0 bg-black bg-opacity-50  h-screen w-screen flex items-center justify-center z-51"
          >
            <div className={`flex items-center justify-center rounded-lg shadow-xl ${isMobile ? 'w-full' : ''}`}>
              <Xgplayer config={config} />
            </div>
          </div>
        </PortalComponent>
      )}
    </div>
  );
};

export default MoviesPreview;
