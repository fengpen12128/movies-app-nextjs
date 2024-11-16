"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Table as TableType, flexRender } from "@tanstack/react-table";

interface DataTableProps<TData> {
  table: TableType<TData>;
  columns: number;
  isLoading?: boolean;
  children?: React.ReactNode;
  height?: string | number;
  scrollable?: boolean;
}

export function DataTable<TData>({
  table,
  columns,
  isLoading,
  children,
  height = "500px",
  scrollable = true,
}: DataTableProps<TData>) {
  const tableContainerStyle = scrollable
    ? {
        height: typeof height === "number" ? `${height}px` : height,
        overflow: "auto",
      }
    : undefined;

  return (
    <div className="space-y-4">
      {children}
      <div className="rounded-md border">
        <div style={tableContainerStyle}>
          <Table>
            <TableHeader className={scrollable ? "sticky top-0 z-10" : undefined}>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns} className="h-24 text-center">
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
                  <TableCell colSpan={columns} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
