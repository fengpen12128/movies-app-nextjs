"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ToolbarProps<TData> {
  table: Table<TData>;
  onSearch: (value: string) => void;
  searchBatchId: string;
  onRefresh: () => void;
}

export function Toolbar<TData>({
  table,
  onSearch,
  searchBatchId,
  onRefresh,
}: ToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex flex-1 items-center space-x-2">
        <label htmlFor="batch-input" className="text-sm font-medium">
          Batch Number:
        </label>
        <Input
          id="batch-input"
          placeholder="Search batch number..."
          value={searchBatchId}
          onChange={(event) => {
            onSearch(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRefresh}
        className="ml-2"
        title="Refresh data"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
}
