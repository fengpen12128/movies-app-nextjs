"use client";

import { Text } from "@radix-ui/themes";
import usePageStore from "@/store/commonStore";

const PaginationInfo: React.FC = () => {
  const pagination = usePageStore((state) => state.pagination);

  if (!pagination) {
    return null;
  }

  const { totalCount, totalPage } = pagination;

  return (
    <div className="flex text-muted-foreground items-center gap-2">
      <Text size="2" weight="medium">
        共 {totalCount} 条
      </Text>
      <Text size="2" weight="medium">
        共 {totalPage} 页
      </Text>
    </div>
  );
};

export default PaginationInfo;
