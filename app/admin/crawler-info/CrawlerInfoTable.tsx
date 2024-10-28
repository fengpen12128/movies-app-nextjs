"use client";

import React from "react";
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
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { columns } from "./columns";
import { getCrawlRecord } from "@/app/actions/admin/crawl";
import { z } from "zod";
import { crawlerInfoSchema } from "./schema";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { CrawlerInfos } from "./schema";

import { TablePagination } from "./components/TablePagination";
import usePageStore from "@/store/commonStore";
import { Toolbar } from "./toolbar";

const CrawlerInfoTable = () => {
  const [page, setPage] = React.useState(1);
  const [searchBatchId, setSearchBatchId] = React.useState("");

  const { data: queryResult, isLoading, refetch } = useQuery({
    queryKey: ["crawlRecord", page, searchBatchId],
    queryFn: async () => {
      const response = await getCrawlRecord({
        page,
        limit: 20,
        batchId: searchBatchId,
      });
      usePageStore.setState({ pagination: response.pagination });
      try {
        return z.array(crawlerInfoSchema).parse(response.data);
      } catch (error) {
        console.error("Error parsing data:", error);
        return [];
      }
    },
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: (queryResult as CrawlerInfos[]) || [],
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (!queryResult && !isLoading) return <div>No data available</div>;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Card className="h-full">
      <CardContent className="p-6 h-full flex flex-col">
        <Toolbar
          table={table}
          onSearch={setSearchBatchId}
          searchBatchId={searchBatchId}
          onRefresh={() => refetch()}
        />
        <div className="flex-1 overflow-auto border rounded-md">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
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
        <TablePagination currentPage={page} onPageChange={handlePageChange} />
      </CardContent>
    </Card>
  );
};

export default CrawlerInfoTable;
