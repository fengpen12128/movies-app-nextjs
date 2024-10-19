"use client";

import { Button, Card, Select } from "@radix-ui/themes";
import React, { useState, useCallback } from "react";
import { ibmPlexMono } from "@/app/fonts";
import HeroVideoDialog from "../ui/hero-video-dialog";

interface VideoPlayResourceProps {
  resources: VideoResource[];
}

export default function VideoPlayResource({
  resources,
}: VideoPlayResourceProps): React.ReactElement {
  const [playMode, setPlayMode] = useState<"IINA" | "Modal">("IINA");
  const [selectedVideoPath, setSelectedVideoPath] = useState<string | null>(
    null
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, path: string): void => {
      e.preventDefault();
      if (playMode === "IINA") {
        const href: string = `iina://weblink?url=${process.env.NEXT_PUBLIC_VIDEO_SERVER_PATH}${path}`;
        if (typeof window !== "undefined" && window.innerWidth <= 768) {
          window.open(href, "_blank");
        } else {
          window.location.href = href;
        }
      } else {
        setSelectedVideoPath(
          `${process.env.NEXT_PUBLIC_VIDEO_SERVER_PATH}${path}`
        );
      }
    },
    [playMode]
  );

  return (
    <Card className={`my-10 ${ibmPlexMono.className}`}>
      <div className="flex justify-between items-center mb-3">
        <div className="text-xl">Select Play</div>
        <Select.Root
          value={playMode}
          onValueChange={(value: "IINA" | "Modal") => setPlayMode(value)}
        >
          <Select.Trigger className="w-24" />
          <Select.Content position="popper" sideOffset={5}>
            <Select.Item value="IINA">IINA</Select.Item>
            <Select.Item value="Modal">Modal</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
      <div className="flex flex-wrap gap-3">
        {resources.map((item: VideoResource) => {
          return (
            <Button
              key={item.id}
              className="cursor-pointer"
              color="cyan"
              variant="outline"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handleClick(e as any, item.path)
              }
            >
              {item.path?.split("/")[0]} ({item.size})
            </Button>
          );
        })}
      </div>
      {selectedVideoPath && (
        <HeroVideoDialog
          directPlay={true}
          animationStyle="from-center"
          videoSrc={selectedVideoPath}
          thumbnailSrc=""
          thumbnailAlt="Hero Video"
        />
      )}
    </Card>
  );
}
