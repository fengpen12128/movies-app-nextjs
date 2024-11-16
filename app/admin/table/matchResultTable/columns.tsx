"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MatchResult } from "./schema";
import { format } from "date-fns";
import { filesize } from "filesize";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<MatchResult>[] = [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "matchCode",
    header: "Match Code",
  },
  {
    accessorKey: "path",
    header: "File Path",
    cell: ({ row }) => (
      <div className="max-w-[500px] truncate" title={row.getValue("path")}>
        {row.getValue("path")}
      </div>
    ),
  },
  {
    accessorKey: "size",
    header: "File Size",
    cell: ({ row }) => filesize(row.getValue("size")),
  },
  {
    accessorKey: "downloadDate",
    header: "Download Date",
    cell: ({ row }) => {
      const date = row.getValue("downloadDate");
      if (!date) return "-";
      return format(
        new Date(row.getValue("downloadDate")),
        "yyyy-MM-dd HH:mm:ss"
      );
    },
  },
  {
    accessorKey: "isMatched",
    header: "Match Status",
    cell: ({ row }) => {
      const status = row.getValue("isMatched") as boolean;
      return (
        <span
          className={cn(
            "font-medium",
            status ? "text-green-600" : "text-red-600"
          )}
        >
          {status ? "匹配成功" : "匹配失败"}
        </span>
      );
    },
  },
];
