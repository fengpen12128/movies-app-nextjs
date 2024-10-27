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
  flexRender,
  ColumnFiltersState,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { columns } from "./columns";

import {
  getScheduleCrawlUrl,
  addScheduleCrawlUrl,
  deleteScheduleCrawlUrl,
} from "@/app/actions/admin/dashboard";
import { z } from "zod";
import { scheduleCrawlUrlSchema } from "./schema";
import { Input } from "@/components/ui/input";

import { DeleteDialog } from "../../components/DeleteDialog";
import { AddDialog } from "./components/AddDialog";
import { toast } from "sonner"; // 需要安装: npm install sonner
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const Index = () => {
  const queryClient = useQueryClient();
  const { data: queryResult, isLoading } = useQuery({
    queryKey: ["scheduleCrawlUrl"],
    queryFn: async () => {
      const response = await getScheduleCrawlUrl();
      return z.array(scheduleCrawlUrlSchema).parse(response.data);
    },
  });

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.log(` rendered ${renderCount.current} times`);
  });

  // 使用 useCallback 和 debounce 优化搜索
  const handleSearch = useCallback(
    debounce((value: string, type: "web" | "url") => {
      setColumnFilters([{ id: type, value }]);
    }, 300),
    []
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    data: queryResult || [], // 添加默认空数组
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    enableRowSelection: true, // Enable row selection
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleAdd = async (dataList: { web: string; url: string }[]) => {
    try {
      const response = await addScheduleCrawlUrl(dataList);
      if (response.code === 200) {
        queryClient.invalidateQueries({ queryKey: ["scheduleCrawlUrl"] });
        toast.success("添加成功");
      } else {
        toast.error(response.msg || "添加失败");
      }
    } catch (error) {
      toast.error("添加失败");
    }
  };

  const handleDelete = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedUrls = selectedRows.map((row) => row.original.url);

    if (selectedUrls.length === 0) return;

    const response = await deleteScheduleCrawlUrl(selectedUrls);
    if (response.code === 200) {
      queryClient.invalidateQueries({ queryKey: ["scheduleCrawlUrl"] });
      setRowSelection({}); // 清除选择状态
    }
  };

  if (!queryResult && !isLoading) return <div>No data available</div>;

  return (
    <>
      <div className="space-y-2 bg-black p-5 rounded-md">
        <div className="flex items-center mb-4 justify-between">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search web ..."
              onChange={(e) => handleSearch(e.target.value, "web")}
              className="h-8 w-[150px] lg:w-[250px]"
            />
            <Input
              placeholder="Search url ..."
              onChange={(e) => handleSearch(e.target.value, "url")}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          </div>
          <div className="flex justify-end p-2 space-x-2">
            <AddDialog onAdd={handleAdd} />
            <DeleteDialog
              selectedCount={table.getSelectedRowModel().rows.length}
              onDelete={handleDelete}
              disabled={table.getSelectedRowModel().rows.length === 0}
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
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      key={row.id}
                    >
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
