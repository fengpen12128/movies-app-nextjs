"use client";

import { Table } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import SelectItem from "@/components/action-panel/components/SelectItemShadcn";
import { Star, Calendar, Clock } from "lucide-react";
import { useState } from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onSearch: (type: "code" | "actress" | "batchNum", value: string) => void;
  onOrderChange: (value: string) => void; // 添加排序变更处理函数
  searchCode: string;
  searchActress: string;
  searchBatchNum: string;
}

export function DataTableToolbar<TData>({
  table,
  onSearch,
  onOrderChange, // 添加新的 prop
  searchCode,
  searchActress,
  searchBatchNum,
}: DataTableToolbarProps<TData>) {
  const items = {
    orders: [
      {
        value: "rateDesc",
        label: "评分 Desc",
        icon: <Star size={16} />,
      },
      { value: "rateAsc", label: "评分 Asc", icon: <Star size={16} /> },
      {
        value: "rateNumDesc",
        label: "评分人数 Desc",
        icon: <Star size={16} />,
      },
      { value: "rateNumAsc", label: "评分人数 Asc", icon: <Star size={16} /> },
      {
        value: "releaseDate",
        label: "上映日期 Desc",
        icon: <Calendar size={16} />,
      },
      {
        value: "releaseDateAsc",
        label: "上映日期 Asc",
        icon: <Calendar size={16} />,
      },
    ],
  };
  const [order, setOrder] = useState("releaseDate");

  // 处理排序变更
  const handleOrderChange = (value: string) => {
    setOrder(value);
    onOrderChange(value);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-6">
        <div className="flex items-center space-x-2">
          <label htmlFor="search-input" className="text-sm font-medium">
            Movie Code:
          </label>
          <Input
            id="search-input"
            placeholder="search code ..."
            value={searchCode}
            onChange={(event) => {
              onSearch("code", event.target.value);
            }}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="actress-input" className="text-sm font-medium">
            Actress:
          </label>
          <Input
            id="actress-input"
            placeholder="search actress ..."
            value={searchActress}
            onChange={(event) => {
              onSearch("actress", event.target.value);
            }}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        </div>
        {/* 添加 BatchNum 搜索框 */}
        <div className="flex items-center space-x-2">
          <label htmlFor="batch-input" className="text-sm font-medium">
            Batch Number:
          </label>
          <Input
            id="batch-input"
            placeholder="search batch ..."
            value={searchBatchNum}
            onChange={(event) => {
              onSearch("batchNum", event.target.value);
            }}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        </div>
      </div>
      <SelectItem
        label=""
        items={items.orders}
        value={order}
        onChange={handleOrderChange}
      />
    </div>
  );
}
