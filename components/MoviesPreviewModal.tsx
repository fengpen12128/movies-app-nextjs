"use client";

import { Card } from "@radix-ui/themes";
import { ReactNode } from "react";
import RenderPortal from "./RenderPortal";
import { Play } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";
// 动态导入 VideoPlayer 组件
const VideoPlayer = dynamic(() => import("@/components/VideoPlayer"), {
  ssr: false, // 禁用服务器端渲染
});

interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
}

export const StackCardContentModal: React.FC<ModalProps> = ({
  open,
  setOpen,
  children,
}) => {
  return (
    <div
      onClick={() => setOpen(false)}
      className="modal-content"
      style={{ display: open ? "flex" : "none" }}
    >
      <Card
        className="w-full sm:w-2/3 h-[80vh] sm:h-[95vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-[98%] sm:w-full h-full overflow-y-auto no-scrollbar">
          {children}
        </div>
      </Card>
    </div>
  );
};

export const MoviesPreviewModal: React.FC<ModalProps> = ({
  open,
  setOpen,
  children,
}) => {
  return (
    <RenderPortal>
      <div
        onClick={() => setOpen(false)}
        className="modal-content z-50"
        style={{ display: open ? "flex" : "none" }}
      >
        <Card
          className=" w-full sm:w-2/3 2xl:w-[60%] h-[80vh] sm:h-[95vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-[98%] sm:w-full h-full overflow-y-auto no-scrollbar">
            {children}
          </div>
        </Card>
      </div>
    </RenderPortal>
  );
};

export const MoviesTrailerModal: React.FC<{
  coverUrl: string;
  videoUrl: string;
}> = ({ coverUrl, videoUrl }) => {
  const [showPlay, setShowPlay] = useState(false);

  return (
    <>
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

      <div className="relative">
        <img
          className="cursor-pointer h-[200px] object-cover"
          src={coverUrl}
          alt=""
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
          <span
            onClick={() => setShowPlay(true)}
            className="text-white cursor-pointer text-5xl"
          >
            <Play color="#FFB6C1" fill="#FFB6C1" size={60} />
          </span>
        </div>
      </div>
    </>
  );
};
