"use client";

import { Card, Flex } from "@radix-ui/themes";
import {
  SlidersHorizontal,
  Star,
  StarOff,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import SelectItem from "./SelectItem";
import { useFilterState } from "@/app/hooks/useFilterState";
import PageationInfo from "../PaginationInfo";

interface Item {
  value: string;
  label: string;
  icon: JSX.Element;
}

interface Items {
  arrange: Item[];
  collected: Item[];
}

export default function DownloadFilter() {
  const [collected, setCollected] = useFilterState("collected", "all");
  const [arrange, setArrange] = useFilterState("arrange", "flex");

  const items: Items = {
    arrange: [
      { value: "flex", label: "Flex", icon: <LayoutGrid size={16} /> },
      { value: "stack", label: "Stack", icon: <LayoutList size={16} /> },
    ],
    collected: [
      { value: "all", label: "全部", icon: <SlidersHorizontal size={16} /> },
      { value: "true", label: "已收藏", icon: <Star size={16} /> },
      { value: "false", label: "未收藏", icon: <StarOff size={16} /> },
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
            label="收藏状态"
            items={items.collected}
            value={collected}
            onChange={setCollected}
          />
        </div>
        <PageationInfo />
      </Flex>
    </Card>
  );
}
