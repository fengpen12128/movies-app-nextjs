"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useSyncUrlParams } from "@/app/hooks/useSyncUrlParams";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  filterOptions: FilterOption[];
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ filterOptions }) => {
  const [filter, setFilter] = useSyncUrlParams("filter", "");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  useEffect(() => {
    if (filter) {
      const filterValues = filter ? filter.split(",") : [];
      setSelectedFilters(filterValues);
    }
  }, [filter]);

  const handleChange = (checked: boolean, value: string) => {
    let newSelected: string[];
    if (checked) {
      newSelected = [...selectedFilters, value];
    } else {
      newSelected = selectedFilters.filter((item) => item !== value);
    }
    setSelectedFilters(newSelected);
    setFilter(newSelected.length > 0 ? newSelected.join(",") : "");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`w-[100px] justify-between ${
            selectedFilters.length > 0
              ? "text-blue-700 hover:text-blue-700"
              : ""
          }`}
        >
          <div className="flex items-center">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filter
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[150px] dark">
        {filterOptions?.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            <Checkbox
              id={option.value}
              checked={selectedFilters.includes(option.value)}
              onCheckedChange={(checked) =>
                handleChange(checked as boolean, option.value)
              }
            />
            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-gray-100">
              {option.label}
            </span>
          </label>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;
