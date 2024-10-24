"use client";

import { useState, useEffect, useContext } from "react";
import { Button, Card, Text, Table, IconButton } from "@radix-ui/themes";
import { Download, RefreshCw } from "lucide-react";
import { Progress, Pagination } from "@nextui-org/react";
import { useRequest } from "ahooks";
import { message } from "react-message-popup";
import useCrawlStore from "@/store/crawlStore";


const DataDownloadTab = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedSize, setDownloadedSize] = useState(0);
  const [downloadTime, setDownloadTime] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const { batchId } = useCrawlStore();

  const {
    data,
    loading,
    run: getDownloadData,
  } = useRequest(
    async () => {
      if (!batchId) {
        return null;
      }
      const res = await fetch(
        `/api/crawl/data/mediaLink/${batchId}?page=${currentPage}`,
        {
          cache: "no-store",
        }
      );
      return await res.json();
    },
    {
      refreshDeps: [currentPage, batchId],
    }
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startDownload = () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadedSize(0);
    setDownloadTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="p-4 relative">
      <div className="absolute top-4 right-4">
        {/* <IconButton
          onClick={() => {
            console.log("getDownloadData");
            getDownloadData();
          }}
          variant="ghost"
        >
          <RefreshCw width="18" height="18" />
        </IconButton> */}
        <Button onClick={getDownloadData}>Refresh</Button>
      </div>
      <div className="flex flex-col gap-4">
        <Text size="6" weight="bold">
          Data Download
        </Text>
        <div className="flex items-center gap-4">
          <Button
            color={isDownloading ? "red" : "green"}
            onClick={startDownload}
            disabled={isDownloading}
          >
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? "Downloading..." : "Start Download"}
          </Button>
          <Text size="3">
            Progress:{" "}
            <span className="font-bold">{downloadProgress.toFixed(2)}%</span>
          </Text>
          <Text size="3">
            Downloaded:{" "}
            <span className="font-bold">{downloadedSize.toFixed(2)} MB</span>
          </Text>
          <Text size="3">
            Time: <span className="font-bold">{formatTime(downloadTime)}</span>
          </Text>
        </div>
        {/* <Progress
          value={downloadProgress}
          color="success"
          className="max-w-md"
          showValueLabel={true}
        /> */}
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Code</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>URL</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data?.data?.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.id}</Table.Cell>
                <Table.Cell>{item.code}</Table.Cell>
                <Table.Cell>{item.url}</Table.Cell>
                <Table.Cell>{item.type}</Table.Cell>
                <Table.Cell>
                  {item.status === 0
                    ? "未下载"
                    : item.status === 1
                    ? "下载成功"
                    : item.status === -1
                    ? "下载失败"
                    : "未下载"}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <div className="flex justify-center mt-4">
          {data?.pagination && (
            <Pagination
              onChange={(page) => handlePageChange(page)}
              page={currentPage}
              total={data?.pagination.totalPage}
              initialPage={1}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DataDownloadTab;
