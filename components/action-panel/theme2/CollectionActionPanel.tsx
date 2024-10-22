"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  LayoutGrid,
  LayoutList,
  Download,
  XCircle,
  SlidersHorizontal,
  Calendar,
  Clock,
  Star,
} from "lucide-react";
import SelectItem from "../components/SelectItemShadcn";
import { useSyncUrlParams } from "@/app/hooks/useSyncUrlParams";
import PaginationInfo from "@/components/PaginationInfo";

interface Item {
  value: string;
  label: string;
  icon: JSX.Element;
}

export default function CollectionActionPanel() {
  const [arrange, setArrange] = useSyncUrlParams("arrange", "flex");
  const [download, setDownload] = useSyncUrlParams("download", "all");
  const [order, setOrder] = useSyncUrlParams("order", "favoriteDesc");

  const items = {
    arrange: [
      { value: "flex", label: "Flex", icon: <LayoutGrid size={16} /> },
      { value: "stack", label: "Stack", icon: <LayoutList size={16} /> },
    ],
    download: [
      { value: "all", label: "All", icon: <SlidersHorizontal size={16} /> },
      { value: "true", label: "Downloaded", icon: <Download size={16} /> },
      { value: "false", label: "Not Downloaded", icon: <XCircle size={16} /> },
    ],
    orders: [
      {
        value: "favoriteDesc",
        label: "收藏日期 Desc",
        icon: <Star size={16} />,
      },
      { value: "favoriteAsc", label: "收藏日期 Asc", icon: <Star size={16} /> },
      { value: "releaseDate", label: "上映日期", icon: <Calendar size={16} /> },
      { value: "crawlDate", label: "爬取日期", icon: <Clock size={16} /> },
    ],
  };
  const orderOptions: OrderOption[] = [
    {
      value: "favoriteDesc",
      label: "收藏日期 Desc",
      icon: <Star className="mr-2 h-4 w-4" />,
    },
    {
      value: "favoriteAsc",
      label: "收藏日期 Asc",
      icon: <Star className="mr-2 h-4 w-4" />,
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
            label="下载状态"
            items={items.download}
            value={download}
            onChange={setDownload}
          />
          <SelectItem
            label=""
            items={items.orders}
            value={order}
            onChange={setOrder}
          />
        </div>
        <div className="flex-shrink-0">
          <PaginationInfo />
        </div>
      </CardContent>
    </Card>
  );
}
