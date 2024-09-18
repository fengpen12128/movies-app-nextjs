"use client";

import { Card, Inset, Badge } from "@radix-ui/themes";
import { useDisplayMode } from "@/hooks/useDisplayMode";
import Image from "next/image";

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
  const displayMode = useDisplayMode();

  return (
    <Card>
      <Inset clip="padding-box" side="top" pb="current">
        {/* <img
          onClick={onClick}
          src={
            displayMode === "normal"
              ? coverUrl
              : process.env.NEXT_PUBLIC_DEMO_IMAGE
          }
          className="object-contain cursor-pointer "
        /> */}
        <Image
          onClick={onClick}
          width={400}
        //   loading="eager"
          height={270}
          layout="responsive"
          src={
            displayMode === "normal"
              ? coverUrl
              : process.env.NEXT_PUBLIC_DEMO_IMAGE
          }
          className=" cursor-pointer "
        />
      </Inset>

      <div className="flex flex-col items-start gap-2 ">
        <h4
          onClick={onClick}
          className="font-suse  text-xl  cursor-pointer hover:underline"
        >
          {code}
        </h4>

        <div className="flex items-center  text-sm text-gray-400">
          <span>{rate}</span>
          <span className="mx-2">•</span>
          <span>{viewCount} views</span>
          <span className="mx-2">•</span>
          {releaseDate ? <span>{releaseDate}</span> : "2000-01-01"}
        </div>

        <div className="flex gap-2  ">
          {collected && <Badge color="crimson">已收藏</Badge>}
          {downloaded && <Badge color="green">已下载</Badge>}
        </div>
      </div>
    </Card>
  );
};

export default MoviesCard;
