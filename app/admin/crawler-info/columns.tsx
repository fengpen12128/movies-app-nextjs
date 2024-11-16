"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CrawlerInfos } from "./schema";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import dayjs from "dayjs";
import { Chip } from "@nextui-org/react";
import { RowActions } from "./row-actions";

export const columns: ColumnDef<CrawlerInfos>[] = [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "batchNum",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Batch Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className=" w-[100px]">{row.getValue("batchNum")}</div>
    ),
  },
  {
    accessorKey: "newlyIncreasedNum",
    header: "Newly Increased",
    cell: ({ row }) => (
      <div className=" w-[30px]">{row.getValue("newlyIncreasedNum")}</div>
    ),
  },
  {
    accessorKey: "updatedNum",
    header: "Updated",
    cell: ({ row }) => (
      <div className=" w-[30px]">{row.getValue("updatedNum")}</div>
    ),
  },
  {
    accessorKey: "startedTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Started Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        {dayjs(row.getValue("startedTime")).format("YYYY-MM-DD HH:mm:ss")}
      </div>
    ),
  },
  {
    accessorKey: "endTime",
    header: "End Time",
    cell: ({ row }) => {
      const endTime = row.getValue("endTime") as Date | null;
      return endTime ? (
        <div>{dayjs(endTime).format("YYYY-MM-DD HH:mm:ss")}</div>
      ) : (
        <div>-</div>
      );
    },
  },
  //   {
  //     accessorKey: "exeTypeStatus",
  //     header: "Execution Type",
  //     cell: ({ row }) => {
  //       const status = row.getValue("exeTypeStatus") as string;
  //       return (
  //         <Badge variant={status === "temp" ? "default" : "secondary"}>
  //           {status}
  //         </Badge>
  //       );
  //     },
  //   },
  {
    accessorKey: "crawlStatus",
    header: "Crawl Status",
    cell: ({ row }) => {
      const status = row.getValue("crawlStatus") as string;
      return (
        <Chip
          color={
            status === "running"
              ? "danger"
              : status === "error"
              ? "danger"
              : status === "not_found"
              ? "warning"
              : status === "pending"
              ? "warning"
              : "success"
          }
          variant="dot"
        >
          {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
        </Chip>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions row={row.original} />,
  },
];
