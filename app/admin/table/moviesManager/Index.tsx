"use client";

import * as React from "react";
import debounce from "lodash/debounce";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  useReactTable,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

import { movieSchema } from "./schema";
import { getMoviesList } from "@/app/actions/admin";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";

import { DataTablePagination } from "../../components/data-table-pagination";
import { DataTableToolbar } from "./searchToolbar";
import useCommonstore from "@/store/commonStore";
import PaginationInfo from "@/components/PaginationInfo";
import { DataTableViewOptions } from "./ViewOption";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DeleteDialog } from "@/app/admin/components/DeleteDialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle } from "lucide-react";
import { useDeleteMovie } from "../../hooks/useDeleteMovie";
import { useDeleteMoviesByCondition } from "../../hooks/useDeleteMoviesByCondition";
import { DataTable as CommonDataTable } from "@/app/admin/components/CommonDataTable";

export default function MoviesManagerTable() {
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
        batchNum: searchParams.batchNum,
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

  const { handleDelete, isPending } = useDeleteMovie(() => {
    table.setRowSelection({});
  });
  const { handleConditionDelete, isPending: isConditionDeletePending } =
    useDeleteMoviesByCondition();

  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);

  // 添加一个函数来检查所有搜索条件是否为空
  const isSearchEmpty = React.useCallback(() => {
    return !Object.values(inputValues).some((value) => value.trim());
  }, [inputValues]);

  return (
    <div className="flex flex-col space-y-4">
      <Card>
        <CardContent className="p-5 rounded-md">
          <DataTableToolbar
            table={table}
            onSearch={handleSearch}
            onOrderChange={handleOrderChange}
            searchCode={inputValues.code}
            searchActress={inputValues.actress}
            searchBatchNum={inputValues.batchNum}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 p-5 rounded-md">
          <CommonDataTable
            table={table}
            columns={columns.length}
            isLoading={isLoading}
            height="calc(100vh - 300px)"
            scrollable={true}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DataTableViewOptions table={table} />
                <DeleteDialog
                  selectedCount={table.getSelectedRowModel().rows.length}
                  onDelete={() => handleDelete(selectedIds)}
                  isPending={isPending}
                  disabled={table.getSelectedRowModel().rows.length === 0}
                  trigger={
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  }
                />
                <DeleteDialog
                  selectedCount={
                    useCommonstore.getState().pagination?.totalCount || 0
                  }
                  onDelete={() =>
                    handleConditionDelete({
                      search: searchParams.code,
                      actressName: searchParams.actress,
                      batchNum: searchParams.batchNum,
                    })
                  }
                  isPending={isConditionDeletePending}
                  disabled={isSearchEmpty()}
                  trigger={
                    <Button variant="outline" size="sm">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      删除筛选结果
                    </Button>
                  }
                />
              </div>
              <PaginationInfo />
            </div>
          </CommonDataTable>
        </CardContent>

        <CardFooter>
          <DataTablePagination
            table={table}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
