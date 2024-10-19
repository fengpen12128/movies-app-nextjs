"use client";

import { Card, Flex } from "@radix-ui/themes";
import {
  LayoutGrid,
  LayoutList,
  Download,
  XCircle,
  SlidersHorizontal,
} from "lucide-react";
import SelectItem from "./components/SelectItem";
import { useSyncUrlParams } from "@/app/hooks/useSyncUrlParams";
import PageationInfo from "../PaginationInfo";

interface Item {
  value: string;
  label: string;
  icon: JSX.Element;
}

interface Items {
  arrange: Item[];
  download: Item[];
}

export default function CollectionActionPanel() {
  const [arrange, setArrange] = useSyncUrlParams("arrange", "flex");
  const [download, setDownload] = useSyncUrlParams("download", "");

  const items: Items = {
    arrange: [
      { value: "flex", label: "Flex", icon: <LayoutGrid size={16} /> },
      { value: "stack", label: "Stack", icon: <LayoutList size={16} /> },
    ],
    download: [
      { value: "", label: "全部", icon: <SlidersHorizontal size={16} /> },
      { value: "true", label: "已下载", icon: <Download size={16} /> },
      { value: "false", label: "未下载", icon: <XCircle size={16} /> },
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
