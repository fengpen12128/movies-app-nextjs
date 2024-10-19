"use client";

import { Card, CardContent } from "@/components/ui/card";

import {
  SlidersHorizontal,
  Star,
  StarOff,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import SelectItem from "./SelectItem";
import { useSyncUrlParams } from "@/app/hooks/useSyncUrlParams";
import PageationInfo from "../PaginationInfo";
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

export default function DownloadFilter() {
  const [collected, setCollected] = useSyncUrlParams("collected", "all");
  const [arrange, setArrange] = useSyncUrlParams("arrange", "flex");

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
      <CardContent className="my-3 p-0">
        <div className="flex justify-between">
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
            <MoviesOrderSelect
              options={orderOptions}
              defaultValue="downloadDesc"
            />
          </div>
          <PageationInfo />
        </div>
      </CardContent>
    </Card>
  );
}
