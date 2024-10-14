"use client";

import { Callout, Button } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useRequest } from "ahooks";
import React from "react";

interface CrawlInfo {
  id: string;
  batchId: string;
  newlyIncreasedNum: number;
  updatedNum: number;
  createdTime: string;
}

const CrawlInfoAlert: React.FC = () => {
  const { data: crawlInfo, run: fetchCrawlInfo } = useRequest(() =>
    fetch("/api/crawlAction").then((res) => res.json())
  );

  const { run: handleConfirm } = useRequest(
    (id: string) =>
      fetch("/api/crawlAction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      }).then((res) => res.json()),
    {
      manual: true,
      onSuccess: () => {
        fetchCrawlInfo();
      },
    }
  );

  return (
    <>
      {crawlInfo &&
        crawlInfo.map((info: any) => (
          <div key={info.id}>
            <Callout.Root color="green">
              <Callout.Icon>
                <InfoCircledIcon />
              </Callout.Icon>
              <Callout.Text>
                <span>
                  批次:{info.batchId} 爬取结束。 新增: {info.newlyIncreasedNum},
                  更新: {info.updatedNum}。
                  {/* 资源下载大小: {info.downloadSize}。*/} 结束时间{" "}
                  {info.createdTime}。
                </span>
                <Button
                  onClick={() => handleConfirm(info.id)}
                  size="1"
                  variant="soft"
                  className="ml-4"
                >
                  确认
                </Button>
              </Callout.Text>
            </Callout.Root>
          </div>
        ))}
    </>
  );
};

export default CrawlInfoAlert;
