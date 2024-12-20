"use client";

import { Flex } from "@radix-ui/themes";
import {
  MixerHorizontalIcon,
  StarFilledIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import SelectItem from "./components/SelectItemShadcn";
import { useSyncUrlParams } from "@/app/hooks/useSyncUrlParams";
import PageationInfo from "../PaginationInfo";
import { zenMaruGothic } from "@/app/fonts";
interface Item {
  value: string;
  label: string;
  icon: JSX.Element;
}

interface Items {
  collected: Item[];
  download: Item[];
  single: Item[];
}

export default function ActressMoviesActionPanel() {
  const [collected, setCollected] = useSyncUrlParams("collected", "all");
  const [download, setDownload] = useSyncUrlParams("download", "all");
  const [single, setSingle] = useSyncUrlParams("single", "all");

  const items: Items = {
    collected: [
      { value: "all", label: "全部", icon: <MixerHorizontalIcon /> },
      { value: "true", label: "已收藏", icon: <StarFilledIcon /> },
      { value: "false", label: "未收藏", icon: <StarIcon /> },
    ],
    download: [
      { value: "all", label: "全部", icon: <MixerHorizontalIcon /> },
      { value: "true", label: "已下载", icon: <StarFilledIcon /> },
      { value: "false", label: "未下载", icon: <StarIcon /> },
    ],
    single: [
      { value: "all", label: "全部", icon: <MixerHorizontalIcon /> },
      { value: "true", label: "单体作品", icon: <StarFilledIcon /> },
      { value: "false", label: "共演作品", icon: <StarIcon /> },
    ],
  };

  return (
    <Flex direction="row" justify="between" align="center">
      <div className={`flex gap-6 ${zenMaruGothic.className}`}>
        <SelectItem
          label="收藏状态"
          items={items.collected}
          value={collected}
          onChange={setCollected}
        />
        <SelectItem
          label="下载状态"
          items={items.download}
          value={download}
          onChange={setDownload}
        />
        <SelectItem
          label="作品类型"
          items={items.single}
          value={single}
          onChange={setSingle}
        />
      </div>

      {/* 分页信息 */}
      <PageationInfo />
    </Flex>
  );
}
