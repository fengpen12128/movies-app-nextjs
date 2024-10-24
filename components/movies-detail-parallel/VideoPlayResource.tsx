"use client";

import { Button, Card, Select, SegmentedControl } from "@radix-ui/themes";
import React, { useState, useCallback } from "react";
import HeroVideoDialog from "../ui/hero-video-dialog";
import { getVideoResource } from "@/app/actions";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function VideoPlayResource({ movieId }: { movieId: number }) {
  const [playMode, setPlayMode] = useState<"IINA" | "Modal">("IINA");
  const [selectedVideoPath, setSelectedVideoPath] = useState<string | null>(
    null
  );

  const { data: resources = [], isLoading: isLoadingVideoResources } = useQuery(
    {
      queryKey: ["videoResources", movieId],
      queryFn: async () => {
        const res = await getVideoResource(movieId);
        return res.data || [];
      },
      enabled: !!movieId, // 确保只有在 movieId 存在时才执行查询
    }
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
    <Card className="my-10">
      <div className="flex justify-between items-center mb-3">
        <div className="text-xl font-ibmPlexMono ">Select Play</div>
        <SegmentedControl.Root
          onValueChange={(value: "IINA" | "Modal") => setPlayMode(value)}
          size="2"
          radius="large"
          defaultValue="IINA"
        >
          <SegmentedControl.Item value="IINA">IINA</SegmentedControl.Item>
          <SegmentedControl.Item value="Modal">Modal</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      {isLoadingVideoResources ? (
        <>Loading...</>
      ) : (
        <div className="flex flex-wrap gap-3">
          {resources.map((item: VideoResource) => (
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
          ))}
        </div>
      )}
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
