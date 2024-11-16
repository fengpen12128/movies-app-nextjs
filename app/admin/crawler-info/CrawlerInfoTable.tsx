"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";

import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/app/admin/components/CommonDataTable";
import { columns } from "./columns";
import { getCrawlRecord } from "@/app/actions/admin/crawl";
import { crawlerInfoSchema } from "./schema";
import { CrawlerInfos } from "./schema";
import { TablePagination } from "./components/TablePagination";
import usePageStore from "@/store/commonStore";
import { Toolbar } from "./toolbar";

const CrawlerInfoTable = () => {
  const [page, setPage] = React.useState(1);
  const [searchbatchNum, setSearchbatchNum] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const {
    data: queryResult,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["crawlRecord", page, searchbatchNum],
    queryFn: async () => {
      const response = await getCrawlRecord({
        page,
        limit: 20,
        batchNum: searchbatchNum,
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
        <div className="flex-1">
          <DataTable
            table={table}
            columns={columns.length}
            isLoading={isLoading}
            height="100%"
          >
            <Toolbar
              table={table}
              onSearch={setSearchbatchNum}
              searchbatchNum={searchbatchNum}
              onRefresh={() => refetch()}
            />
          </DataTable>
        </div>
        <TablePagination currentPage={page} onPageChange={handlePageChange} />
      </CardContent>
    </Card>
  );
};

export default CrawlerInfoTable;
