import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface DeleteDialogProps {
  selectedCount: number;
  onDelete: () => void;
  disabled?: boolean;
  trigger: React.ReactNode;
  isPending?: boolean;
}

export function DeleteDialog({
  selectedCount,
  onDelete,
  disabled = false,
  trigger,
  isPending = false,
}: DeleteDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild disabled={disabled}>
        {trigger}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除</AlertDialogTitle>
          <AlertDialogDescription>
            你确定要删除选中的 {selectedCount} 条记录吗？ 此操作无法撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="bg-red-800 text-white    hover:bg-red-900"
            disabled={disabled || isPending}
          >
            {isPending ? "删除中..." : "删除"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
