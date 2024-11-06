"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { MovieTable } from "./schema";
import { DeleteDialog } from "@/app/admin/components/DeleteDialog";
import { useState } from "react";
import { useDeleteMovie } from "../hooks/useDeleteMovie";

interface DataTableRowActionsProps {
  row: Row<MovieTable>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const movie = row.original;
  const [open, setOpen] = useState(false);
  const { handleDelete, isPending } = useDeleteMovie(() => setOpen(false));

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DeleteDialog
          selectedCount={1}
          onDelete={() => handleDelete(movie.id)}
          disabled={isPending}
          trigger={
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <div className="flex items-center gap-2 w-full">
                <Trash2 className="h-4 w-4" />
                <span>删除</span>
              </div>
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
