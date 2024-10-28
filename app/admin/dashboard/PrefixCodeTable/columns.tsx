"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PrefixCodes } from "./schema";
import { DataTableColumnHeader } from "@/app/admin/components/column-header";
import { Button as NextUIButton } from "@nextui-org/react";
import Link from "next/link";

export const columns: ColumnDef<PrefixCodes>[] = [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "prefix",
    header: "Prefix",
    cell: ({ row }) => (
      <Link
        target="_blank"
        className="hover:underline hover:text-blue-500 hover:underline-offset-2"
        href={`/home?prefix=${row.getValue("prefix")}`}
      >
        {row.getValue("prefix")}
      </Link>
    ),
    filterFn: (row, columnId, filterValue) => {
      const prefix = row.getValue(columnId) as string;
      return prefix.toLowerCase().startsWith(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "num",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Number" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("num")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "maker",
    header: "Maker",
    cell: ({ row }) => (
      <Link
        target="_blank"
        className="hover:underline w-[100px] hover:text-blue-500 hover:underline-offset-2"
        href={`/home?maker=${row.getValue("maker")}`}
      >
        {row.getValue("maker")}
      </Link>
    ),
    enableSorting: false,
    enableHiding: false,
    filterFn: (row, columnId, filterValue) => {
      const maker = row.getValue(columnId) as string;
      return maker.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "website",
    header: () => <div>Website</div>,
    cell: ({ row }) => (
      <NextUIButton
        size="sm"
        as={Link}
        href={`https://javdb.com/video_codes/${row.getValue("prefix")}`}
        color="default"
        variant="ghost"
        endContent={<img className="w-3" src="/s1.png" alt="" />}
        target="_blank"
        rel="noopener noreferrer"
      >
        Javdb
      </NextUIButton>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
