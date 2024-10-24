"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PrefixCode } from "./schema";
import { DataTableColumnHeader } from "@/app/admin/moviesManager/components/data-table-column-header";
import dayjs from "dayjs";
import Link from "next/link";

export const columns: ColumnDef<PrefixCode>[] = [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => <div className="w-[50px]">{row.getValue("code")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "num",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Num" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("num")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "brand",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Brand" />
    ),
    cell: ({ row }) => {
      const brand = row.getValue("brand");
      return <div className="w-[100px]">{brand as string}</div>;
    },
  },
  {
    accessorKey: "score",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Score" />
    ),
    cell: ({ row }) => <div className="w-[40px]">{row.getValue("score")}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "website",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Website" />
    ),
    cell: ({ row }) => (
      <div className="w-[40px]">
        <Link
          href={`https://javdb.com/video_codes/${row.getValue("code")}`}
          target="_blank"
        >
          Javdb
        </Link>
      </div>
    ),

    enableHiding: false,
  },
];
