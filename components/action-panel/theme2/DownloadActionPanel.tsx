"use client";

import { Card, CardContent } from "@/components/ui/card";

import {
  SlidersHorizontal,
  Star,
  StarOff,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import SelectItem from "../components/SelectItem2";
import { useSyncUrlParams } from "@/app/hooks/useSyncUrlParams";
import PaginationInfo from "@/components/PaginationInfo";
import MoviesOrderSelect from "@/components/MoviesOrderSelect";
import { Calendar, Clock, Download } from "lucide-react";
interface Item {
  value: string;
  label: string;
  icon: JSX.Element;
}

interface Items {
  arrange: Item[];
  collected: Item[];
}

export default function DownloadActionPanel() {
  const [collected, setCollected] = useSyncUrlParams("collected", "all");
  const [arrange, setArrange] = useSyncUrlParams("arrange", "flex");

  const items: Items = {
    arrange: [
      { value: "flex", label: "Flex", icon: <LayoutGrid size={16} /> },
      { value: "stack", label: "Stack", icon: <LayoutList size={16} /> },
    ],
    collected: [
      { value: "all", label: "All", icon: <SlidersHorizontal size={16} /> },
      { value: "true", label: "Collected", icon: <Star size={16} /> },
      { value: "false", label: "Not Collected", icon: <StarOff size={16} /> },
    ],
  };

  const orderOptions: OrderOption[] = [
    {
      value: "downloadDesc",
      label: "下载日期 Desc",
      icon: <Download className="mr-2 h-4 w-4" />,
    },
    {
      value: "downloadAsc",
      label: "下载日期 Asc",
      icon: <Download className="mr-2 h-4 w-4" />,
    },
    {
      value: "releaseDate",
      label: "上映日期",
      icon: <Calendar className="mr-2 h-4 w-4" />,
    },
    {
      value: "crawlDate",
      label: "爬取日期",
      icon: <Clock className="mr-2 h-4 w-4" />,
    },
  ];

  return (
    <Card>
      <CardContent className="flex items-center justify-between m-3 p-0 overflow-x-auto">
        <div className="flex items-center gap-6 min-w-max">
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
          <MoviesOrderSelect
            options={orderOptions}
            defaultValue="downloadDesc"
          />
        </div>
        <div className="flex-shrink-0">
          <PaginationInfo />
        </div>
      </CardContent>
    </Card>
  );
}
