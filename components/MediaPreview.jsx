"use client";

import "react-photo-view/dist/react-photo-view.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { useState } from "react";
import PortalComponent from "@/components/PortalComponent";
import Xgplayer from "xgplayer-react";
import { nanoid } from "nanoid";

const MoviesPreview = ({ mediaUrls = [] }) => {
  const videoUrl = mediaUrls.find((x) => x.type == 3)?.path;
  const coverUrl = mediaUrls.find((x) => x.type == 2)?.path;
  const introUrls = mediaUrls
    .filter((x) => x.type == 1)
    .map((x) => ({
      id: nanoid(),
      path: x.path,
    }));

  const config = {
    url: videoUrl,
    //    url: "http://127.0.0.1:9000/demo/douying_sample.mp4",
    loop: true,
    autoplay: true,
    volume: 0,
    poster: "",
    muted: false,
    width: 1000,
    height: 750,
  };

  const handlePlayVideo = () => {
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      window.open(config.url, "_blank");
    } else {
      setShowPlay(true);
    }
  };

  const [showPlay, setShowPlay] = useState(false);

  return (
    // <div className="w-full rounded grid grid-cols-4 gap-2  p-2 bg-[#F4F4F5] dark:bg-gray-800 ">
    <div className="w-full rounded grid grid-cols-2 sm:grid-cols-4 gap-2  p-2">
      {/* <div className="img-container relative">
        <img
          className="cursor-pointer h-[200px] object-fill"
          src={coverUrl}
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
      </div> */}

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
            ▶
          </span>
        </div>
      </div>

      <PhotoProvider loop maskOpacity={0.5}>
        {introUrls.map((x) => (
          <PhotoView key={x.id} src={x.path}>
            <img
              style={{ objectFit: "cover" }}
              className="h-[200px] w-full  cursor-pointer"
              src={x.path}
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
            <div className="flex items-center  justify-center rounded-lg shadow-xl">
              <Xgplayer config={config} />
            </div>
          </div>
        </PortalComponent>
      )}
    </div>
  );
};

export default MoviesPreview;
