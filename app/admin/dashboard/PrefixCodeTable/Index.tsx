"use client";

import React, { useCallback } from "react";
import debounce from "lodash/debounce";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { columns } from "./columns";
import { getPrefixStatistics } from "@/app/actions/admin/dashboard";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { prefixCodeSchema } from "./schema";
import { PrefixCodes } from "./schema";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DataTable } from "@/app/admin/components/CommonDataTable";

const Index = () => {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const { data: queryResult, isLoading } = useQuery({
    queryKey: ["prefixStatistics"],
    queryFn: async () => {
      const response = await getPrefixStatistics();
      return z.array(prefixCodeSchema).parse(response.data);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const handleSearch = useCallback(
    debounce((value: string, type: "prefix" | "maker") => {
      setColumnFilters([{ id: type, value }]);
    }, 300),
    []
  );

  const table = useReactTable({
    data: (queryResult as PrefixCodes[]) || [],
    columns,
    state: {
      columnFilters,
    },
    enableRowSelection: false,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 30,
      },
    },
  });

  if (!queryResult && !isLoading) return <div>No data available</div>;

  return (
    <Card>
      <CardContent className="space-y-2 py-4 rounded-md">
        <DataTable table={table} columns={columns.length} isLoading={isLoading}>
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
        </DataTable>
        <div className="flex items-center justify-center space-x-2 py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    table.getCanPreviousPage() && table.previousPage()
                  }
                  className={
                    !table.getCanPreviousPage()
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">
                  {table.getState().pagination.pageIndex + 1} /{" "}
                  {table.getPageCount()}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => table.getCanNextPage() && table.nextPage()}
                  className={
                    !table.getCanNextPage()
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
};

export default Index;
