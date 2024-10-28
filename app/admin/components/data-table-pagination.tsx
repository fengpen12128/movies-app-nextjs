"use client";

import { Table } from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useCommonstore from "@/store/commonStore";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function DataTablePagination<TData>({
  table,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps<TData>) {
  const [jumpToPage, setJumpToPage] = useState("");
  const { pagination } = useCommonstore(); // 从 store 获取分页信息

  const handlePageChange = (newPage: number) => {
    table.setPageIndex(newPage);
    onPageChange(newPage + 1);
  };

  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpToPage);
    if (pageNumber && pageNumber > 0 && pageNumber <= pagination!.totalPage) {
      handlePageChange(pageNumber - 1);
      setJumpToPage("");
    }
  };

  const currentPage = table.getState().pagination.pageIndex;
  const totalPages = pagination?.totalPage || 1;

  // 修改生成页码的函数
  const generatePaginationItems = () => {
    const items = [];
    const showPages = 5; // 显示的页码数量

    let startPage = Math.max(0, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages - 1, startPage + showPages - 1);

    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(0, endPage - showPages + 1);
    }

    // 添加页码按钮
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
            isActive={currentPage === i}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // 添加省略号和最后一页
    if (startPage > 0) {
      items.unshift(
        <PaginationItem key="start-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
      // 添加第一页
      items.unshift(
        <PaginationItem key="first">
          <PaginationLink
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(0);
            }}
            isActive={currentPage === 0}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
    }
    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="end-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
      // 添加最后一页
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages - 1);
            }}
            isActive={currentPage === totalPages - 1}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 px-2 py-1">
      {/* 左侧选中信息 */}
      <div className="text-sm text-muted-foreground order-2 sm:order-1">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>

      {/* 右侧分页控制区 */}
      <div className="flex flex-1 flex-col sm:flex-row items-center justify-end gap-4 order-1 sm:order-2">
        {/* 每页显示数量选择器 */}
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium whitespace-nowrap">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              const newPageSize = Number(value);
              table.setPageSize(newPageSize);
              onPageSizeChange(newPageSize);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 分页导航 */}
        <div className="flex items-center gap-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                  className={
                    !table.getCanPreviousPage()
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>

              {generatePaginationItems()}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                  className={
                    !table.getCanNextPage()
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* 页码跳转 */}
          <div className="flex items-center gap-2">
            <Input
              className="h-8 w-[70px]"
              value={jumpToPage}
              onChange={(e) => setJumpToPage(e.target.value)}
              placeholder="Page"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleJumpToPage();
                }
              }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleJumpToPage}
              className="h-8 px-3"
            >
              Go
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
