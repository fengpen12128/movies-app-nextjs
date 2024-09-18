"use client";

import { Card, Select, Flex, Text } from "@radix-ui/themes";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GridIcon, StackIcon, DownloadIcon, CrossCircledIcon, MixerHorizontalIcon } from "@radix-ui/react-icons";

export default function CollectionSettings() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [arrange, setArrange] = useState(searchParams.get("arrange") || "flex");
  const [download, setDownload] = useState(
    searchParams.get("download") || "all"
  );

  const updateQuery = (key, value) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set(key, value);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${window.location.pathname}${query}`);
  };

  const handleChange = (value) => {
    setArrange(value);
    updateQuery("arrange", value);
  };

  const handleDownloadChange = (value) => {
    setDownload(value);
    updateQuery("download", value);
  };

  return (
    <Card className="my-3 p-4">
      <Flex direction="row" gap="6" align="center" wrap="wrap">
        <Flex align="center" gap="3">
          <Text weight="bold">排列方式</Text>
          <Select.Root value={arrange} onValueChange={handleChange} size="2">
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="flex">
                <Flex align="center" gap="2">
                  <GridIcon />
                  <Text>Flex</Text>
                </Flex>
              </Select.Item>
              <Select.Item value="stack">
                <Flex align="center" gap="2">
                  <StackIcon />
                  <Text>Stack</Text>
                </Flex>
              </Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
        <Flex align="center" gap="3">
          <Text weight="bold">下载状态</Text>
          <Select.Root
            value={download}
            onValueChange={handleDownloadChange}
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
                  <DownloadIcon />
                  <Text>已下载</Text>
                </Flex>
              </Select.Item>
              <Select.Item value="false">
                <Flex align="center" gap="2">
                  <CrossCircledIcon />
                  <Text>未下载</Text>
                </Flex>
              </Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>
    </Card>
  );
}
