"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

const ButtonListPopover: React.FC<OptionGroup> = ({
  title = "",
  options = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleSelect = (option: string) => {
    if (option === "All") {
      setSelectedOption(null);
    } else {
      setSelectedOption(option);
    }
    goto(option);
    setIsOpen(false);
  };
  const goto = (option: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (option === "All") {
      current.delete(title.toLowerCase());
    } else {
      current.set(title.toLowerCase(), option);
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/home${query}`);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={`flex items-center gap-2  justify-between ${
            selectedOption ? "text-blue-700" : ""
          }`}
        >
          <span className="truncate">
            {selectedOption ? selectedOption : title}
          </span>
          {isOpen ? (
            <ChevronUp
              size={18}
              className={selectedOption ? "text-blue-700" : ""}
            />
          ) : (
            <ChevronDown
              size={18}
              className={selectedOption ? "text-blue-700" : ""}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full sm:w-[700px] bg-black/70 backdrop-blur-sm max-h-[500px] overflow-y-auto">
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          <Button
            className="bg-black/20"
            onClick={() => handleSelect("All")}
            variant="outline"
          >
            All
          </Button>
          {options.map((option) => (
            <Button
              key={option}
              variant="outline"
              className={` bg-black/20 ${
                selectedOption === option ? "text-blue-700" : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ButtonListPopover;
