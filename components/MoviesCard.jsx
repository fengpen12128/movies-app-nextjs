"use client";

import { Card, Inset, Badge } from "@radix-ui/themes";
import { useLocalStorageState } from "ahooks";
import getGlobalSettings from "@/app/globalSetting";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";

const MoviesCard = ({
  code,
  rate,
  viewCount = 0,
  releaseDate,
  collected = false,
  downloaded = false,
  coverUrl,
  onClick,
  createdTime,
  tags,
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

  const isNewThisWeek = useMemo(() => {
    if (!createdTime || !dayjs(createdTime).isValid()) return false;
    const createdDate = dayjs(createdTime);
    const threeDaysLater = createdDate.add(3, "day");
    const currentDate = dayjs();
    return threeDaysLater.isAfter(currentDate);
  }, [createdTime]);

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
      <div className="flex flex-col items-start gap-2 min-h-[84px]">
        <h4
          onClick={onClick}
          className="font-suse text-xl cursor-pointer hover:underline"
        >
          {code}
        </h4>

        <div className="flex items-center text-sm text-gray-400">
          <span>{rate}</span>
          <span className="mx-2">•</span>
          <span>{viewCount} views</span>
          <span className="mx-2">•</span>
          {releaseDate ? <span>{releaseDate}</span> : "2000-01-01"}
        </div>

        <div className="flex gap-2 min-h-5">
          {isNewThisWeek && <Badge color="blue">本周新片</Badge>}
          {collected && <Badge color="crimson">已收藏</Badge>}
          {downloaded && <Badge color="green">已下载</Badge>}
          {tags?.map((tag) => (
            <Badge key={tag} color="blue">
              {tag.tagName}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default MoviesCard;
