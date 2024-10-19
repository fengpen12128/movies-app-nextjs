"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { useRequest } from "ahooks";
import { Badge, Spinner } from "@radix-ui/themes";
import { Badge as NextuiBadge } from "@nextui-org/react";
import { Chip } from "@nextui-org/react";
import _ from "lodash";
import { Eye } from "lucide-react";
import { getCrawlRecord } from "@/app/actions/admin/crawl";
import { useSpiderActions } from "@/app/hooks/useSpiderActions";
import { getUnDownloadNum } from "@/app/actions/admin/crawl";

interface DownloadProcess {
  percent?: number;
  total_size_str?: string;
  status?: string;
}

const ClawerTable: React.FC = () => {
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadProcess, setDownloadProcess] = useState<DownloadProcess>({});
  const { data: crawlResponse, loading, error } = useRequest(getCrawlRecord);
  const { data: crawlData, pagination } = crawlResponse || {};

  const [unDownloadNum, setUnDownloadNum] = useState<number>(0);
  const { transferringBatches, downloadingBatches, executeSpiderEndActions } =
    useSpiderActions();

  useRequest(getUnDownloadNum, {
    onSuccess: (data) => {
      if (data?.code === 200 && data.data) {
        const { imageNum = 0, videoNum = 0 } = data.data;
        setUnDownloadNum(imageNum);
      }
    },
  });

  const { runAsync: handleDownloadData } = useRequest(
    async () => {
      setDownloadLoading(true);
      await fetch(`/api/crawl/action/download/1`);

      const checkProgress = async () => {
        const response = await fetch("/api/crawl/action/download/process");
        const data: DownloadProcess = await response.json();
        setDownloadProcess(data);

        if (data.status === "completed") {
          setDownloadLoading(false);
          return;
        }

        setTimeout(checkProgress, 1000);
      };

      checkProgress();
    },
    {
      manual: true,
    }
  );

  const exeTypeStatus: { [key: string]: string } = {
    temp: "手动执行",
    scheduled: "定时执行",
  };

  const handleDataTrans = (batchId: string) => executeSpiderEndActions(batchId);

  const renderTransButton = (
    transStatus: number,
    batchId: string,
    isFinished: boolean
  ) => {
    if (transferringBatches.includes(batchId)) {
      return (
        <Button variant="secondary" size="sm" disabled>
          转换中...
        </Button>
      );
    }

    if (transStatus == 1) {
      return (
        <>
          <Button variant="secondary" size="sm">
            reTrans
          </Button>
          <Link
            href={`/home?batchId=${batchId}`}
            className="flex items-center text-blue-500 hover:underline dark:text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Eye className="w-4 h-4 mr-1" />
            查看
          </Link>
        </>
      );
    }

    if (isFinished) {
      return (
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleDataTrans(batchId)}
          >
            转换数据
          </Button>
        </>
      );
    }
  };

  return (
    <div className="overflow-x-auto  ">
      <div className="flex items-center space-x-4 py-2 mb-4">
        <NextuiBadge content={unDownloadNum} size="sm" color="danger">
          <Button
            onClick={() => handleDownloadData()}
            disabled={downloadLoading}
            variant="outline"
          >
            {downloadLoading ? "下载中..." : "开始下载"}
          </Button>
        </NextuiBadge>

        <div className="flex-grow">
          <Progress value={downloadProcess?.percent} />
          <div className="flex justify-between mt-1 text-sm">
            <span>{downloadProcess?.percent?.toFixed(2)}%</span>
            <span>总量: {downloadProcess?.total_size_str}</span>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <span className="text-red-500">加载数据时出错</span>
        </div>
      ) : crawlData && crawlData.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow className="dark:border-gray-700">
              <TableHead className="dark:text-gray-300">批次号</TableHead>
              <TableHead className="dark:text-gray-300">新增</TableHead>
              <TableHead className="dark:text-gray-300">更新</TableHead>
              <TableHead className="dark:text-gray-300">开始时间</TableHead>
              <TableHead className="dark:text-gray-300">结束时间</TableHead>
              <TableHead className="dark:text-gray-300">执行类别</TableHead>
              <TableHead className="dark:text-gray-300">状态</TableHead>
              <TableHead className="dark:text-gray-300">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {crawlData.map((row: CrawlStat) => (
              <TableRow key={row.id} className="dark:border-gray-700">
                <TableCell className="dark:text-gray-300">
                  <Link
                    href={`/admin/crawlerManager?batchId=${row.batchId}`}
                    className="text-blue-500 hover:underline dark:text-blue-400"
                  >
                    {row.batchId}
                  </Link>
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {row.newlyIncreasedNum}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {row.updatedNum}
                </TableCell>

                <TableCell className="dark:text-gray-300">
                  {dayjs(row.startedTime).format("YYYY-MM-DD HH:mm:ss")}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {row.endTime
                    ? dayjs(row.endTime).format("YYYY-MM-DD HH:mm:ss")
                    : "-"}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  <Badge color="cyan">{exeTypeStatus[row.executeType]}</Badge>
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {row.crawlStatus === "running" ? (
                    <Chip color="danger" variant="dot">
                      {_.capitalize(row.crawlStatus)}
                    </Chip>
                  ) : (
                    <Chip color="success" variant="dot">
                      {_.capitalize(row.crawlStatus)}
                    </Chip>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-row items-center space-x-2">
                    {renderTransButton(
                      Number(row.transStatus ?? 0),
                      row.batchId,
                      row.crawlStatus === "finished"
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex justify-center items-center h-64">
          <span className="text-gray-500">暂无数据</span>
        </div>
      )}
    </div>
  );
};

export default ClawerTable;
