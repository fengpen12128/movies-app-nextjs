"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Movie } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import dayjs from "dayjs";

export const columns: ColumnDef<Movie>[] = [
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
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[50px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rate Num" />
    ),
    cell: ({ row }) => (
      <div className="w-[40px]">{row.getValue("rateNum")}</div>
    ),

    enableHiding: false,
  },
  {
    accessorKey: "actresses",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actresses" />
    ),
    cell: ({ row }) => {
      const actresses = row.getValue("actresses") as {
        id: number;
        actressName: string;
      }[];

      if (!actresses) {
        return null;
      }

      return (
        <div className="flex w-[150px] flex-wrap items-center">
          {actresses.slice(0, 3).map((actress) => (
            <Badge key={actress.id} variant="outline" className="mr-1 mb-1">
              {actress.actressName}
            </Badge>
          ))}
          {actresses.length > 3 && (
            <div className="relative group">
              <Badge variant="outline" className="mr-1 mb-1 cursor-pointer">
                +{actresses.length - 3}
              </Badge>
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10">
                <div className="bg-black p-2 rounded shadow-lg w-[300px]">
                  <div className="flex flex-wrap">
                    {actresses
                      .slice(3)
                      .reduce((rows: any[], actress: any, index: number) => {
                        if (index % 3 === 0) rows.push([]);
                        rows[rows.length - 1].push(actress);
                        return rows;
                      }, [])
                      .map((row, rowIndex) => (
                        <div key={rowIndex} className="flex w-full mb-1">
                          {row.map((actress: any) => (
                            <Badge
                              key={actress.id}
                              variant="outline"
                              className="mr-1 text-white"
                            >
                              {actress.actressName}
                            </Badge>
                          ))}
                        </div>
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Scraped Time" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px]">
        {dayjs(row.getValue("createdTime")).format("YYYY-MM-DD HH:mm:ss")}
      </div>
    ),
  },
  //   {
  //     accessorKey: "priority",
  //     header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title="Priority" />
  //     ),
  //     cell: ({ row }) => {
  //       const priority = priorities.find(
  //         (priority) => priority.value === row.getValue("priority")
  //       );

  //       if (!priority) {
  //         return null;
  //       }

  //       return (
  //         <div className="flex items-center">
  //           {priority.icon && (
  //             <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //           )}
  //           <span>{priority.label}</span>
  //         </div>
  //       );
  //     },
  //     filterFn: (row, id, value) => {
  //       return value.includes(row.getValue(id));
  //     },
  //   },
  //   {
  //     id: "actions",
  //     cell: ({ row }) => <DataTableRowActions row={row} />,
  //   },
];
