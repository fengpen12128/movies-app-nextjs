"use client";

import Plyr, { APITypes, PlyrProps, PlyrInstance } from "plyr-react";
import "plyr-react/plyr.css";

interface VideoPlayerProps {
  src: string;
  width?: string | number;
}

export default function VideoPlayer({ src, width = "100%" }: VideoPlayerProps) {
  const plyrProps: PlyrProps = {
    source: {
      type: "video",
      sources: [
        {
          src,
          type: "video/mp4",
        },
      ],
    },
    options: {
      autoplay: true,
      muted: true,
      loop: {
        active: true,
      },
    },
  };

  return (
    <div style={{ width }}>
      <Plyr {...plyrProps} />
    </div>
  );
}
