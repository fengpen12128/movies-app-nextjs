"use client";

import { Badge, Button, Spinner } from "@radix-ui/themes";
import { Image } from "@nextui-org/image";
import NextImage from "next/image";
import { message } from "react-message-popup";
import { toggleCollection } from "@/app/actions";
import { usePathname } from "next/navigation";
import dayjs from "dayjs";
import { zenMaruGothic } from "@/app/fonts";
import { useState } from "react";
interface MoviesInfoProps {
  movie: Movie;
}
const MoviesInfo: React.FC<MoviesInfoProps> = ({ movie }) => {
  const pathname = usePathname();

  const [isCollecting, setIsCollecting] = useState(false);
  const [isCollected, setIsCollected] = useState(movie.collected);

  const toggleCollect = async (): Promise<void> => {
    if (!movie) return;
    setIsCollecting(true);
    const resp = await toggleCollection(movie.id, pathname);
    if (resp.code === 200) {
      setIsCollected(!isCollected);
      message.success(resp.msg || "操作成功", 1000);
    } else {
      message.error(resp.msg || "操作失败", 1000);
    }
    setIsCollecting(false);
  };

  const [prefix, suffix] = movie.code.split("-") || [];

  const handleActressClick = (name: string): void => {
    window.open(`actressMovies/?name=${name}`, "_blank");
  };

  const handlePrefixClick = (prefix: string): void => {
    if (!prefix) return;
    window.open(`/home/?prefix=${prefix}`, "_blank");
  };

  const { rate, rateNum, duration, releaseDate, actresses, tags, coverUrl } =
    movie;

  return (
    <div className="flex p-2 gap-4 flex-col sm:flex-row">
      <div className="w-full sm:w-[60%] mr-10 flex items-center ">
        <Image
          as={NextImage}
          width={600}
          height={403}
          loading="eager"
          priority
          style={{ maxHeight: "500px", width: "auto" }}
          className=" object-contain"
          isBlurred
          alt="preview"
          src={coverUrl}
        />
      </div>

      <div className="w-full sm:w-[40%]">
        <ul className="space-y-4">
          <li className=" font-ibmPlexMono text-3xl text-[#0abab5] flex items-baseline">
            <span
              className="hover:underline cursor-pointer  text-[1.15em] transition-colors duration-200 ease-in-out hover:text-[#08a19d]"
              onClick={() => handlePrefixClick(prefix)}
            >
              {prefix}
            </span>
            <span>-{suffix}</span>
          </li>
          <InfoItem label="评分" value={rate} />
          <InfoItem label="评分数" value={rateNum} />
          <InfoItem label="时长" value={duration} />
          <InfoItem
            label="演员"
            value={
              <>
                {actresses?.map((item: Actress) => (
                  <span
                    key={item.id}
                    onClick={() => handleActressClick(item.actressName)}
                    className="hover:underline cursor-pointer ml-1"
                  >
                    <Badge
                      className={`${zenMaruGothic.className} text-md`}
                      variant="surface"
                      color="blue"
                    >
                      {item.actressName}
                    </Badge>
                  </span>
                ))}
              </>
            }
          />
          <InfoItem
            label="发行时间"
            value={dayjs(releaseDate).format("YYYY-MM-DD")}
          />
          {tags && tags.length > 0 && (
            <InfoItem
              label="标签"
              value={
                <>
                  {tags.map((item: Tag) => (
                    <Badge key={item.id} variant="surface" color="cyan">
                      {item.tagName}
                    </Badge>
                  ))}
                </>
              }
            />
          )}
        </ul>
        <div className="flex space-x-2 ml-0 sm:ml-10 mt-4 sm:mt-12">
          <Button
            onClick={toggleCollect}
            className="cursor-pointer"
            color="crimson"
            variant="soft"
            disabled={isCollecting}
          >
            {isCollecting ? <Spinner /> : isCollected ? "取消收藏" : "收藏"}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <li>
    <span className={`${zenMaruGothic.className} text-gray-500 text-md`}>
      {label}：
    </span>
    {value}
  </li>
);

export default MoviesInfo;
