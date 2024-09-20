"use client";

import { Card, Inset, Badge } from "@radix-ui/themes";
import { useLocalStorageState } from "ahooks";
import getGlobalSettings from "@/app/globalSetting";
import Image from "next/image";
import { useState, useEffect } from "react";

const MoviesCard = ({
  code,
  rate,
  viewCount = 0,
  releaseDate,
  collected = false,
  downloaded = false,
  coverUrl,
  onClick,
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [globalSettings] = useLocalStorageState("GlobalSettings", {
    defaultValue: getGlobalSettings(),
    listenStorageChange: true,
  });

  const mode = globalSettings?.displayMode;

  // Ensure useDisplayMode is called only on the client
  useEffect(() => {
    const imageUrl =
      mode === "normal" ? coverUrl : process.env.NEXT_PUBLIC_DEMO_IMAGE;
    setImageUrl(imageUrl);
  }, [mode]);

  return (
    <Card>
      <Inset clip="padding-box" side="top" pb="current">
        {imageUrl !== null ? (
          <Image
            alt="preview"
            onClick={onClick}
            width={400}
            loading="eager"
            height={270}
            priority
            src={imageUrl}
            className="cursor-pointer object-contain"
          />
        ) : (
          <div className="min-h-[250px]"></div>
        )}
      </Inset>

      {/* <Inset clip="padding-box" side="top" pb="current">
        <Image
          alt="preview"
          onClick={onClick}
          width={400}
          loading="eager"
          height={270}
          priority
          src={imageUrl}
          className="cursor-pointer object-contain"
        />
      </Inset> */}

      <div className="flex flex-col items-start gap-2">
        <h4
          onClick={onClick}
          className="font-suse text-xl cursor-pointer hover:underline"
        >
          {code}
          {/* Temp {JSON.stringify(globalSettings?.displayMode)} */}
        </h4>

        <div className="flex items-center text-sm text-gray-400">
          <span>{rate}</span>
          <span className="mx-2">•</span>
          <span>{viewCount} views</span>
          <span className="mx-2">•</span>
          {releaseDate ? <span>{releaseDate}</span> : "2000-01-01"}
        </div>

        <div className="flex gap-2 min-h-5">
          {collected && <Badge color="crimson">已收藏</Badge>}
          {downloaded && <Badge color="green">已下载</Badge>}
        </div>
      </div>
    </Card>
  );
};

export default MoviesCard;
