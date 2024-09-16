"use client";

import { Card, Select, Flex, Text } from "@radix-ui/themes";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MixerHorizontalIcon, StarFilledIcon, StarIcon } from "@radix-ui/react-icons";

export default function DownloadSettings() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [collected, setCollected] = useState(
    searchParams.get("collected") || "all"
  );

  const updateQuery = (value) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("collected", value);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${window.location.pathname}${query}`);
  };

  const handleCollectedChange = (value) => {
    setCollected(value);
    updateQuery(value);
  };

  return (
    <Card className="my-3 p-4">
      <Flex direction="row" gap="6" align="center" wrap="wrap">
        <Flex align="center" gap="3">
          <Text weight="bold">收藏状态</Text>
          <Select.Root
            value={collected}
            onValueChange={handleCollectedChange}
            size="2"
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="all">
                <Flex align="center" gap="2">
                  <MixerHorizontalIcon />
                  <Text>全部</Text>
                </Flex>
              </Select.Item>
              <Select.Item value="true">
                <Flex align="center" gap="2">
                  <StarFilledIcon />
                  <Text>已收藏</Text>
                </Flex>
              </Select.Item>
              <Select.Item value="false">
                <Flex align="center" gap="2">
                  <StarIcon />
                  <Text>未收藏</Text>
                </Flex>
              </Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>
    </Card>
  );
}
