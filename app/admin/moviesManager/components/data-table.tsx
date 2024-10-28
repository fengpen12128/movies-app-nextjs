"use client";

import * as React from "react";
import debounce from "lodash/debounce";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { movieSchema, MovieTable } from "./schema";
import { getMoviesList } from "@/app/actions/admin";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";

import { DataTablePagination } from "../../components/data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import useCommonstore from "@/store/commonStore";
import PaginationInfo from "@/components/PaginationInfo";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { DataTableViewOptions } from "./data-table-view-options";
import { Card, CardContent } from "@/components/ui/card";

export function DataTable() {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20); // 添加 pageSize 状态

  // 分别维护输入框的状态和API查询的状态
  const [inputValues, setInputValues] = React.useState({
    code: "",
    actress: "",
    batchNum: "", // 添加 batchNum
  });
  const [searchParams, setSearchParams] = React.useState({
    code: "",
    actress: "",
    batchNum: "", // 添加 batchNum
  });

  // 创建防抖的搜索参数更新函数
  const debouncedSetSearchParams = React.useRef(
    debounce((newParams) => {
      setSearchParams(newParams);
      setCurrentPage(1);
    }, 300)
  ).current;

  // 处理输入变化
  const handleSearch = (
    type: "code" | "actress" | "batchNum",
    value: string
  ) => {
    // 立即更新输入框的值
    setInputValues((prev) => ({
      ...prev,
      [type]: value,
    }));

    // 防抖更新搜索参数
    debouncedSetSearchParams({
      ...inputValues,
      [type]: value,
    });
  };

  // 添加排序状态
  const [orderValue, setOrderValue] = React.useState<MovieOrder | undefined>(
    undefined
  );

  // 处理排序变更
  const handleOrderChange = (value: string) => {
    setOrderValue(value as MovieOrder);
    setCurrentPage(1); // 重置到第一页
  };

  // 查询数据
  const { data: moviesResult, isLoading } = useQuery({
    queryKey: [
      "moviesList",
      currentPage,
      pageSize,
      searchParams.code,
      searchParams.actress,
      searchParams.batchNum,
      orderValue, // 添加排序值到 queryKey
    ],
    queryFn: async () => {
      const response = await getMoviesList({
        page: currentPage,
        pageSize: pageSize,
        search: searchParams.code,
        actressName: searchParams.actress,
        batchId: searchParams.batchNum,
        order: orderValue, // 传入排序值
      });
      useCommonstore.getState().setPagination(response.pagination!);
      return z.array(movieSchema).parse(response.data);
    },
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // 添加平滑滚动到顶部
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    // 这里也添加滚动到顶部
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 清理防抖
  React.useEffect(() => {
    return () => {
      debouncedSetSearchParams.cancel();
    };
  }, []);

  // 在 DataTable 组件中添加处理函数
  const handleActressClick = React.useCallback((actressName: string) => {
    setInputValues((prev) => ({
      ...prev,
      actress: actressName,
    }));

    debouncedSetSearchParams((prev: any) => ({
      ...prev,
      actress: actressName,
    }));
  }, []);

  const table = useReactTable({
    data: moviesResult || [],
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: pageSize,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    meta: {
      onActressClick: handleActressClick,
    },
  });

  return (
    <>
      <Card>
        <CardContent className=" p-5 rounded-md">
          <DataTableToolbar
            table={table}
            onSearch={handleSearch}
            onOrderChange={handleOrderChange} // 添加排序处理函数
            searchCode={inputValues.code}
            searchActress={inputValues.actress}
            searchBatchNum={inputValues.batchNum}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2  p-5 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <DataTableViewOptions table={table} />
            </div>
            <PaginationInfo />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
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
                      className="h-24 text-center relative"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <LoadingSpinner />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
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
          <DataTablePagination
            table={table}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>
    </>
  );
}
