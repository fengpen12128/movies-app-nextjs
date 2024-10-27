"use client";

import React, { useCallback } from "react";
import debounce from "lodash/debounce"; // 需要安装 lodash
import { LoadingSpinner } from "@/components/LoadingSpinner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  flexRender,
  ColumnFiltersState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { columns } from "./columns";
import { getPrefixStatistics } from "@/app/actions/admin/dashboard";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { prefixCodeSchema } from "./schema";
import { Input } from "@/components/ui/input";
import { PrefixCodes } from "./schema";
const Index = () => {
  const { data: queryResult, isLoading } = useQuery({
    queryKey: ["prefixStatistics"],
    queryFn: async () => {
      const response = await getPrefixStatistics();
      return z.array(prefixCodeSchema).parse(response.data);
    },
    // 修改缓存配置
    staleTime: 5 * 60 * 1000, // 数据在 5 分钟内被视为新鲜
    gcTime: 30 * 60 * 1000, // 垃圾回收时间，替代原来的 cacheTime
  });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  // 使用 useCallback 和 debounce 优化搜索
  const handleSearch = useCallback(
    debounce((value: string, type: "prefix" | "maker") => {
      setColumnFilters([{ id: type, value }]);
    }, 300),
    []
  );

  const table = useReactTable({
    data: queryResult as PrefixCodes[],
    columns,
    state: {
      columnFilters,
    },
    enableRowSelection: false, // 禁用行选择
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // 移除不必要的功能
    // getFacetedRowModel: getFacetedRowModel(),
    // getFacetedUniqueValues: getFacetedUniqueValues(),
    // getPaginationRowModel: getPaginationRowModel(),
  });

  if (!queryResult && !isLoading) return <div>No data available</div>;

  return (
    <>
      <div className="space-y-2 bg-black p-5 rounded-md">
        <div className="flex items-center mb-4 justify-between">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search prefix ..."
              onChange={(e) => handleSearch(e.target.value, "prefix")}
              className="h-8 w-[150px] lg:w-[250px]"
            />
            <Input
              placeholder="Search maker ..."
              onChange={(e) => handleSearch(e.target.value, "maker")}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <div className="h-[500px] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-black z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <LoadingSpinner />
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
