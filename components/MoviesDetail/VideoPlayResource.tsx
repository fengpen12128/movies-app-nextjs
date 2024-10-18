"use client";

import { Button, Card } from "@radix-ui/themes";
import React from "react";
import { ibmPlexMono } from "@/app/fonts";

interface VideoPlayResourceProps {
  resources: VideoResource[];
}

export default function VideoPlayResource({
  resources,
}: VideoPlayResourceProps): React.ReactElement {
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ): void => {
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      e.preventDefault();
      window.open(href, "_blank");
    }
  };

  return (
    <Card className={`my-10 ${ibmPlexMono.className}`}>
      <div className="text-xl ">Select Play</div>
      <div className="flex flex-wrap gap-3 mt-3">
        {resources.map((item: VideoResource) => {
          const href: string =
            typeof window !== "undefined" && window.innerWidth <= 768
              ? `${process.env.NEXT_PUBLIC_VIDEO_SERVER_PATH}${item.path}`
              : `iina://weblink?url=${process.env.NEXT_PUBLIC_VIDEO_SERVER_PATH}${item.path}`;
          return (
            <a
              key={item.id}
              href={href}
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
                handleClick(e, href)
              }
            >
              <Button className="cursor-pointer" color="cyan" variant="outline">
                {item.path?.split("/")[0]} ({item.size})
              </Button>
            </a>
          );
        })}
      </div>
    </Card>
  );
}
