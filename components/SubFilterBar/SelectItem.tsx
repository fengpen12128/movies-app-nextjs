import React from "react";
import { Select, Flex, Text } from "@radix-ui/themes";

interface SelectItemProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  items: { value: string; label: string; icon?: React.ReactNode }[];
}

const SelectItem: React.FC<SelectItemProps> = ({
  label,
  value,
  onChange,
  items = [],
}) => {
  return (
    <Flex align="center" gap="3">
      <Text weight="bold">{label}</Text>
      <Select.Root value={value} onValueChange={onChange} size="2">
        <Select.Trigger />
        <Select.Content>
          {items.map((item) => (
            <Select.Item key={item.value} value={item.value}>
              <Flex align="center" gap="2">
                {item.icon}
                <Text>{item.label}</Text>
              </Flex>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Flex>
  );
};

export default SelectItem;
