"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { MovieTable } from "./schema";
import { Trash2, DeleteIcon } from "lucide-react";
import { DeleteDialog } from "@/app/admin/components/DeleteDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DataTableRowActionsProps {
  row: Row<MovieTable>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const movie = row.original;
  const queryClient = useQueryClient();

  const { mutate: handleDelete, isPending } = useMutation({
    mutationFn: async () => {
      // TODO: 实现删除逻辑
      console.log("Delete movie:", movie);
    },
    onSuccess: () => {
      // 删除成功后刷新数据
      queryClient.invalidateQueries({ queryKey: ["moviesList"] });
      toast.success("删除成功");
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      toast.error("删除失败");
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <DeleteDialog
            selectedCount={1}
            onDelete={() => handleDelete()}
            disabled={isPending}
            trigger={
              <div className="flex items-center gap-2 w-full">
                <Trash2 className="h-4 w-4 text-red-600" />
                <span>删除</span>
              </div>
            }
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
