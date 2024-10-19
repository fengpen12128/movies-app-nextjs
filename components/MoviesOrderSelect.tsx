"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useSyncUrlParams } from "@/app/hooks/useSyncUrlParams";

interface OrderOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface OrderSelectProps {
  options: OrderOption[];
  defaultValue?: string;
}

const OrderSelect: React.FC<OrderSelectProps> = ({
  options,
  defaultValue = "releaseDate",
}) => {
  const [order, setOrder] = useSyncUrlParams("order", defaultValue);

  return (
    <Select value={order} onValueChange={setOrder}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="选择排序方式" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center">
              {option.icon}
              {option.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default OrderSelect;
