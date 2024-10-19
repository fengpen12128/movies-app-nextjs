"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  LayoutGrid,
  LayoutList,
  Download,
  XCircle,
  SlidersHorizontal,
} from "lucide-react";
import SelectItem from "../components/SelectItem2";
import { useSyncUrlParams } from "@/app/hooks/useSyncUrlParams";
import PageationInfo from "../../PaginationInfo";
import MoviesOrderSelect from "@/components/MoviesOrderSelect";
import { Calendar, Clock, Star } from "lucide-react";

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
  const [download, setDownload] = useSyncUrlParams("download", "all");

  const items: Items = {
    arrange: [
      { value: "flex", label: "Flex", icon: <LayoutGrid size={16} /> },
      { value: "stack", label: "Stack", icon: <LayoutList size={16} /> },
    ],
    download: [
      { value: "all", label: "All", icon: <SlidersHorizontal size={16} /> },
      { value: "true", label: "Downloaded", icon: <Download size={16} /> },
      { value: "false", label: "Not Downloaded", icon: <XCircle size={16} /> },
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
      <CardContent className="my-3 p-0 ">
        <div className="flex-between mx-3">
          <div className="flex gap-6 ">
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
            <MoviesOrderSelect
              options={orderOptions}
              defaultValue="favoriteDesc"
            />
          </div>
          <PageationInfo />
        </div>
      </CardContent>
    </Card>
  );
}
