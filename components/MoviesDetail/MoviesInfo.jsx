import { Badge, Button, Spinner } from "@radix-ui/themes";
import { Image } from "@nextui-org/image";
import { message } from "react-message-popup";
import { useState } from "react";
import { useDisplayMode } from "@/hooks/useDisplayMode";
import { toggleCollection } from "@/app/actions/index_bak";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const displayMode = useDisplayMode();
  const [isCollected, setIsCollected] = useState(initialCollected);
  const [isCollecting, setIsCollecting] = useState(false);
  const [open, setOpen] = useState(false);
  coverUrl =
    displayMode === "normal" ? coverUrl : process.env.NEXT_PUBLIC_DEMO_IMAGE;

  const handleActressClick = (name) => {
    window.open(`actressMovies/?name=${name}`, "_blank");
  };

  const toggleCollect = async () => {
    setIsCollecting(true);
    const [isSuccess, msg] = await toggleCollection(code, pathname);
    if (isSuccess) {
      setIsCollected(!isCollected);
      message.success(msg, 1000);
    } else {
      message.error(msg, 1000);
    }
    setIsCollecting(false);
  };

  const [prefix, suffix] = code.split("-");

  const handlePlay = () => {
    if (!videoFirst) {
      message.error("没有播放资源", 1000);
      return;
    }
    window.open(videoFirst, "_blank", "noopener,noreferrer");
  };

  const handlePrefixClick = (prefix) => {
    if (!prefix) return;
    window.open(`/?prefix=${prefix}`, "_blank");
  };

  return (
    <div className="flex p-2 gap-4 flex-col sm:flex-row">
      <div className="w-full sm:w-[60%] mr-10 flex items-center">
        <Image
          isBlurred
          alt="preview"
          src={coverUrl}
          onClick={() => {
            setOpen(true);
          }}
        />
      </div>

      <div className="w-full sm:w-[40%]">
        <ul className="space-y-4">
          <li className="font-suse text-3xl text-secondary">
            <span
              className="hover:underline cursor-pointer"
              onClick={() => handlePrefixClick(prefix)}
            >
              {prefix}
            </span>
            -{suffix}
          </li>
          <InfoItem label="评分" value={rate} />
          <InfoItem label="评分数" value={rateNum} />
          <InfoItem label="时长" value={duration} />
          <InfoItem
            label="演员"
            value={
              <>
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
              </>
            }
          />
          <InfoItem
            label="发行时间"
            value={new Date(releaseDate)?.toISOString().split("T")[0]}
          />
          <InfoItem
            label="标签"
            value={
              <>
                {tags?.map((item) => (
                  <Badge variant="surface" color="cyan">
                    {item.tagName}
                  </Badge>
                ))}
              </>
            }
          />
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
            disabled={isCollecting}
          >
            {isCollecting ? <Spinner /> : isCollected ? "取消收藏" : "收藏"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <li>
    <span className="text-gray-500 text-sm">{label}：</span>
    {value}
  </li>
);

export default MoviesInfo;
