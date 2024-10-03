"use client";

import { Flex, Text } from "@radix-ui/themes";
import usePageStore from "@/utils/commonStore";

const PageationInfo = () => {
  const p = usePageStore((state) => state.pagination);

  return (
    <Flex gap="4" align="center">
      {p && (
        <>
          <Text size="2" weight="medium">
            共 {p.totalPage * 50} 条
          </Text>
          <Text size="2" weight="medium">
            共 {p.totalPage} 页
          </Text>
        </>
      )}
    </Flex>
  );
};

export default PageationInfo;
