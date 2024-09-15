import { Badge, Button } from "@radix-ui/themes";
import { message } from "react-message-popup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDisplayMode } from "@/hooks/useDisplayMode";
const MoviesInfo = ({
  code,
  coverUrl,
  rate,
  rateNum,
  duration,
  actresses,
  releaseDate,
  collected: initialCollected,
  tags,
  videoFirst,
}) => {
  const displayMode = useDisplayMode();
  const [isCollected, setIsCollected] = useState(initialCollected);
  const handleActressClick = (name) => {
    window.open(`actressMovies/?actressName=${name}`, "_blank");
  };
  const toggleCollect = async () => {
    const resp = await fetch(`/api/movies/collected/${code}`);
    const data = await resp.json();

    if (resp.status === 500) {
      message.error(data.message, 1000);
      return;
    }

    setIsCollected(!isCollected);
    message.success(data.message, 1000);
  };

  const codeSplit = code.split("-");

  const handlePlay = () => {
    if (!videoFirst) {
      message.error("没有播放资源", 1000);
      return;
    }

    // const url = `https://ommsjjjwtgpdklis.public.blob.vercel-storage.com/douying_sample-JOrHnYGM2XTUzq1qZLMIZt8OfWKcIW.mp4`;
    window.open(videoFirst, "_blank", "noopener,noreferrer");
  };

  const handlePrefixClick = (prefix) => {
    if (!prefix) return;
    window.open(`/?prefix=${prefix}`, "_blank");
  };

  return (
    <div className="flex gap-4 mt-5  flex-col  sm:flex-row sm:gap">
      <img
        // className="w-1/2 mr-10 object-contain bg-gray-100 dark:bg-gray-800 "
        className="w-full sm:w-1/2 mr-10 h-[350px] object-contain  "
        src={
          displayMode === "normal"
            ? coverUrl
            : process.env.NEXT_PUBLIC_DEMO_IMAGE
        }
        alt=""
      />

      <div className="w-full sm:w-1/2">
        <ul className="space-y-4">
          <li className="font-suse text-3xl text-secondary">
            <span
              className="hover:underline cursor-pointer"
              onClick={() => handlePrefixClick(codeSplit[0])}
            >
              {codeSplit[0]}
            </span>
            -{codeSplit[1]}
          </li>
          <li>
            <span className="text-gray-500 text-sm">评分：</span>
            {rate}
          </li>
          <li>
            <span className="text-gray-500 text-sm">评分数：</span>
            {rateNum}
          </li>
          <li>
            <span className="text-gray-500 text-sm">时长：</span>
            {duration}
          </li>
          <li>
            <span className="text-gray-500 text-sm">演员：</span>
            {actresses?.map((item) => (
              <span
                key={item.id}
                onClick={() => handleActressClick(item.actressName)}
                className="hover:underline cursor-pointer ml-1"
              >
                <Badge variant="surface" color="blue">
                  {item.actressName}
                </Badge>
              </span>
            ))}
          </li>
          <li>
            <span className="text-gray-500 text-sm">发行时间：</span>
            {new Date(releaseDate)?.toISOString().split("T")[0]}
          </li>
          <li>
            <span className="text-gray-500 text-sm">标签：</span>
            {tags?.map((item) => (
              <div key={item.id} className="badge badge-accent">
                {item.tagName}
              </div>
            ))}
          </li>
        </ul>
        <div className="flex space-x-2 ml-0 sm:ml-10 mt-4 sm:mt-12">
          <Button
            onClick={handlePlay}
            className="cursor-pointer"
            color="indigo"
            variant="soft"
          >
            立即播放
          </Button>
          <Button
            onClick={toggleCollect}
            className="cursor-pointer"
            color="crimson"
            variant="soft"
          >
            {isCollected ? "取消收藏" : "收藏"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MoviesInfo;
