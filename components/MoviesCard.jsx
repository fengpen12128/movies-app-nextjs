import { Card, Inset, Badge, Skeleton } from "@radix-ui/themes";
import { useState } from "react";

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
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };
  return (
    <Card>
      <Inset clip="padding-box" side="top" pb="current">
        {/* {isLoading && <Skeleton className="h-[300px]"></Skeleton>} */}

        <img
          onClick={onClick}
          src={coverUrl}
          onLoad={handleImageLoad}
          className="object-cover cursor-pointer h-[250px]"
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
          <span>{new Date(releaseDate).toISOString().split("T")[0]}</span>
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
