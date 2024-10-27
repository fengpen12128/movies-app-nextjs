"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ScheduleCrawlUrl } from "./schema";
import Link from "next/link";
import dayjs from "dayjs";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<ScheduleCrawlUrl>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "index",
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "web",
    header: "Web",
    cell: ({ row }) => (
      <Link
        target="_blank"
        className="hover:underline hover:text-blue-500 hover:underline-offset-2"
        href="https://javdb.com"
      >
        {row.getValue("web")}
      </Link>
    ),
    filterFn: (row, columnId, filterValue) => {
      const web = row.getValue(columnId) as string;
      return web.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "url",
    header: "Url",
    cell: ({ row }) => <div className="w-[250px]">{row.getValue("url")}</div>,
    filterFn: (row, columnId, filterValue) => {
      const url = row.getValue(columnId) as string;
      return url.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "createdTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Created Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="w-[100px]">
        {dayjs(row.getValue("createdTime")).format("YYYY-MM-DD")}
      </div>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as Date;
      const b = rowB.getValue(columnId) as Date;
      return a.getTime() - b.getTime();
    },
  },
];
