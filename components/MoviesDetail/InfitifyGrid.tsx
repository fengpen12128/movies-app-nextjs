import * as React from "react";
import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";

type ImageItem = {
  groupKey: number;
  key: number;
  url: string;
  type: "image";
};

type VideoItem = {
  groupKey: number;
  key: number;
  videoUrl: string;
  coverUrl: string;
  type: "video";
};

type Item = ImageItem | VideoItem;

function getItems(
  nextGroupKey: number,
  urls: string[],
  videoUrl: string,
  coverUrl: string
): Item[] {
  const imageItems: ImageItem[] = urls.map((url, index) => ({
    groupKey: nextGroupKey,
    key: nextGroupKey * (urls.length + 1) + index,
    url,
    type: "image",
  }));

  const videoItem: VideoItem = {
    groupKey: nextGroupKey,
    key: nextGroupKey * (urls.length + 1) + urls.length,
    videoUrl,
    coverUrl,
    type: "video",
  };

  return [videoItem, ...imageItems];
}

const ImageItem = ({ path }: { path: string }) => (
  <div className="item" style={{ width: "33%" }}>
    <div className="thumbnail">
      <PhotoView src={path}>
        <img
          src={path}
          alt="preview"
          className="cursor-pointer w-full h-auto"
        />
      </PhotoView>
    </div>
  </div>
);

const VideoItem = ({
  videoUrl,
  coverUrl,
}: {
  videoUrl: string;
  coverUrl: string;
}) => (
  <div className="item" style={{ width: "33%" }}>
    <HeroVideoDialog
      animationStyle="from-center"
      videoSrc={videoUrl}
      thumbnailSrc={coverUrl}
      thumbnailAlt="Hero Video"
    />
  </div>
);

export default function App({
  introUrls,
  videoUrl,
  coverUrl,
}: {
  introUrls: string[];
  videoUrl: string;
  coverUrl: string;
}) {
  const [items, setItems] = React.useState<Item[]>(() =>
    getItems(0, introUrls, videoUrl, coverUrl)
  );

  return (
    <PhotoProvider loop maskOpacity={0.5}>
      <MasonryInfiniteGrid
        className="container"
        gap={5}
        onRequestAppend={(e) => {
          const nextGroupKey = (+e.groupKey! || 0) + 1;
          setItems([
            ...items,
            ...getItems(nextGroupKey, introUrls, videoUrl, coverUrl),
          ]);
        }}
      >
        {items.map((item) =>
          item.type === "image" ? (
            <ImageItem
              data-grid-groupkey={item.groupKey}
              key={item.key}
              path={item.url}
            />
          ) : (
            <VideoItem
              data-grid-groupkey={item.groupKey}
              key={item.key}
              videoUrl={item.videoUrl}
              coverUrl={item.coverUrl}
            />
          )
        )}
      </MasonryInfiniteGrid>
    </PhotoProvider>
  );
}
