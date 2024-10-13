"use client";

import { Card, Flex } from "@radix-ui/themes";
import { SlidersHorizontal, Star, StarOff } from "lucide-react";
import SelectItem from "./SelectItem";
import { useFilterState } from "./Common";
import PageationInfo from "../PaginationInfo";

export default function DownloadFilter() {
  const [collected, setCollected] = useFilterState("collected", "all");

  const items = [
    { value: "all", label: "全部", icon: <SlidersHorizontal size={16} /> },
    { value: "true", label: "已收藏", icon: <Star size={16} /> },
    { value: "false", label: "未收藏", icon: <StarOff size={16} /> },
  ];

  return (
    <Card className="my-3 p-4">
      <Flex direction="row" justify="between" align="center">
        <div className="flex gap-6">
          <SelectItem
            label="收藏状态"
            items={items}
            value={collected}
            onChange={setCollected}
          />
        </div>
        <PageationInfo />
      </Flex>
    </Card>
  );
}
