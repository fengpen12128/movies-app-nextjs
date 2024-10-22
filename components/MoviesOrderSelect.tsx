"use client";

import SelectItem from "@/components/action-panel/components/SelectItemShadcn";

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
    <SelectItem label="" items={options} value={order} onChange={setOrder} />
  );
};

export default OrderSelect;
