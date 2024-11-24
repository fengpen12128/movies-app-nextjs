"use client";

import { useState } from "react";
import { columns } from "./columns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ColumnFiltersState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "../../components/CommonDataTable";
import {
  getMatchResult,
  getUnMatchedResource,
} from "@/app/actions/resource/getMatchResult";
import { z } from "zod";
import { matchResultSchema } from "./schema";
import { saveResourceList } from "@/app/actions/resource";
import { message } from "react-message-popup";

const renameVideos = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SCRIPT_BACKEND_ENDPOINT}/rename-videos`);
  if (!response.ok) {
    throw new Error("重命名失败");
  }
  const data = await response.json();
  if (data.status !== "success") {
    throw new Error("重命名失败");
  }
};

export default function MatchResultTable() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [activeTab, setActiveTab] = useState<string>("matched");

  const { data: queryResult, isLoading } = useQuery({
    queryKey: ["matchResult", activeTab],
    queryFn: async () => {
      if (activeTab === "matched") {
        const result = await getMatchResult();
        return z.array(matchResultSchema).parse(result.data);
      } else {
        const result = await getUnMatchedResource();
        console.log("result", result);
        try {
          return z.array(matchResultSchema).parse(result.data);
        } catch (error) {
          console.error("error", error);
          return [];
        }
      }
    },
    // // 每次 tab 切换时都重新获取数据
    // staleTime: 0,
    // // 数据缓存时间为 30 分钟
    // gcTime: 30 * 60 * 1000,
    // // 确保组件挂载和 activeTab 改变时重新获取数据
    // refetchOnMount: true,
    // refetchOnWindowFocus: false,
  });

  const queryClient = useQueryClient();

  const { mutate: saveMatch, isPending } = useMutation({
    mutationFn: saveResourceList,
    onSuccess: (response) => {
      if (response.code === 200) {
        message.success("保存成功");
        // 保存成功后刷新数据
        queryClient.invalidateQueries({ queryKey: ["matchResult", activeTab] });
      } else {
        message.error(response.msg || "保存失败");
      }
    },
    onError: (error) => {
      message.error("操作失败");
    },
  });

  const { mutate: handleRename, isPending: isRenaming } = useMutation({
    mutationFn: renameVideos,
    onSuccess: (response) => {
      message.success("重命名成功");
      // 刷新表格数据
      queryClient.invalidateQueries({ queryKey: ["matchResult", activeTab] });
    },
    onError: (error) => {
      message.error("重命名失败");
    },
  });

  const handleSaveMatch = () => {
    if (!queryResult) return;
    saveMatch(queryResult as any);
  };

  const table = useReactTable({
    data: queryResult || [],
    columns,
    enableRowSelection: false,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  const handleSearch = (value: string, field: string) => {
    setColumnFilters([
      {
        id: field,
        value: value,
      },
    ]);
  };

  return (
    <Card>
      <CardContent className="space-y-2 py-4 rounded-md">
        <DataTable
          height="calc(100vh - 200px)"
          scrollable={true}
          table={table}
          columns={columns.length}
          isLoading={isLoading}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="matched">Matched</TabsTrigger>
              <TabsTrigger value="unmatched">Unmatched</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center space-x-4 mb-4">
            <Button
              onClick={handleSaveMatch}
              disabled={isPending || !queryResult}
            >
              {isPending ? "保存中..." : "配对"}
            </Button>
            <Button onClick={() => handleRename()} disabled={isRenaming}>
              {isRenaming ? "重命名中..." : "重命名"}
            </Button>
            <Input
              placeholder="Search code ..."
              onChange={(e) => handleSearch(e.target.value, "code")}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          </div>
        </DataTable>
      </CardContent>
    </Card>
  );
}
