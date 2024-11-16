"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MovieTable } from "./schema";
import { DataTableColumnHeader } from "../../components/column-header";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableRowActions } from "./rowActions";

import dayjs from "dayjs";

// 创建一个新的组件来处理 Actress Badge 的点击事件
interface ActressBadgeProps {
  actress: { id: number; actressName: string };
  onActressClick: (actressName: string) => void;
}

const ActressBadge = ({ actress, onActressClick }: ActressBadgeProps) => (
  <Badge
    variant="outline"
    className="mr-1 mb-1 cursor-pointer hover:bg-accent"
    onClick={(e) => {
      e.stopPropagation();
      onActressClick(actress.actressName);
    }}
  >
    {actress.actressName}
  </Badge>
);

export const columns: ColumnDef<MovieTable>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("code")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "releaseDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Release Date" />
    ),
    cell: ({ row }) => {
      const releaseDate = row.getValue("releaseDate") as Date;
      return (
        <div className="w-[100px]">
          {dayjs(releaseDate).format("YYYY-MM-DD")}
        </div>
      );
    },
  },
  {
    accessorKey: "rate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rate" />
    ),
    cell: ({ row }) => <div className="w-[40px]">{row.getValue("rate")}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "rateNum",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Rate Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="w-[60px]">{row.getValue("rateNum")}</div>
    ),

    enableHiding: false,
  },
  {
    accessorKey: "actresses",
    header: "Actresses",
    cell: ({ row, table }) => {
      const actresses = row.getValue("actresses") as {
        id: number;
        actressName: string;
      }[];

      if (!actresses) {
        return null;
      }

      const onActressClick = (table.options.meta as any)?.onActressClick;

      return (
        <div className="flex w-[150px] flex-wrap items-center">
          {actresses.slice(0, 3).map((actress) => (
            <ActressBadge
              key={actress.id}
              actress={actress}
              onActressClick={onActressClick}
            />
          ))}
          {actresses.length > 3 && (
            <div className="relative group">
              <Badge variant="outline" className="mr-1 mb-1 cursor-pointer">
                +{actresses.length - 3}
              </Badge>
              {/* 修改这部分的 hover 效果 */}
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10">
                {/* 添加一个透明的连接区域 */}
                <div className="absolute h-2 w-full bottom-0 translate-y-full" />
                <div className="bg-black p-2 rounded shadow-lg w-[300px] hover:block">
                  <div className="flex flex-wrap gap-1">
                    {actresses.slice(3).map((actress) => (
                      <ActressBadge
                        key={actress.id}
                        actress={actress}
                        onActressClick={onActressClick}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
      <div className="w-[200px]">
        {dayjs(row.getValue("createdTime")).format("YYYY-MM-DD HH:mm:ss")}
      </div>
    ),
  },
  {
    accessorKey: "batchNum",
    header: "Batch Number",
    cell: ({ row }) => (
      <div className="w-[150px]">{row.getValue("batchNum")}</div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
];
