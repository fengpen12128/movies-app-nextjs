"use client";

import { Card, Flex } from "@radix-ui/themes";
import {
  GridIcon,
  StackIcon,
  DownloadIcon,
  CrossCircledIcon,
  MixerHorizontalIcon,
} from "@radix-ui/react-icons";
import SelectItem from "./SelectItem";
import { useFilterState } from "./Common";
import PageationInfo from "../PaginationInfo";

export default function CollectionFilter() {
  const [arrange, setArrange] = useFilterState("arrange", "flex");
  const [download, setDownload] = useFilterState("download", "all");

  const items = {
    arrange: [
      { value: "flex", label: "Flex", icon: <GridIcon /> },
      { value: "stack", label: "Stack", icon: <StackIcon /> },
    ],
    download: [
      { value: "all", label: "全部", icon: <MixerHorizontalIcon /> },
      { value: "true", label: "已下载", icon: <DownloadIcon /> },
      { value: "false", label: "未下载", icon: <CrossCircledIcon /> },
    ],
  };

  return (
    <Card className="my-3 p-4">
      <Flex direction="row" justify="between" align="center">
        <div className="flex gap-6">
          <SelectItem
            label="排列方式"
            items={items.arrange}
            value={arrange}
            onChange={setArrange}
          />
          <SelectItem
            label="下载状态"
            items={items.download}
            value={download}
            onChange={setDownload}
          />
        </div>

        <PageationInfo />
      </Flex>
    </Card>
  );
}
