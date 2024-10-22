import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SelectItemProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  items: { value: string; label: string; icon?: React.ReactNode }[];
}

const SelectComponent: React.FC<SelectItemProps> = ({
  label,
  value,
  onChange,
  items = [],
}) => {
  return (
    <div className="flex items-center space-x-3 ">
      <Label htmlFor={label}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={label}>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent className="bg-black/60 backdrop-blur-sm">
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              <div className="flex items-center space-x-2">
                {item.icon}
                <span>{item.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectComponent;
