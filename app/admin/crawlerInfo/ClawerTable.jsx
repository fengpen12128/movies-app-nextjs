import React, { useState } from "react";
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
import { message } from "react-message-popup";
import { useRequest } from "ahooks";
import { Badge } from "@radix-ui/themes";
import { Chip } from "@nextui-org/react";
import _ from "lodash";
import { Eye } from "lucide-react";

import ConfirmAlertDialog from "@/components/radix/ConfirmAlertDialog";

const ClawerTable = ({ data }) => {
  const [transLoading, setTransLoading] = useState({});
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadProcess, setDownloadProcess] = useState("");

  const { runAsync: handleDownloadData } = useRequest(
    async () => {
      setDownloadLoading(true);
      await fetch(`/api/crawl/action/download/1`);

      const checkProgress = async () => {
        const response = await fetch("/api/crawl/action/download/process");
        const data = await response.json();
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

  const { runAsync: handleTransData } = useRequest(
    async (batchId) => {
      setTransLoading((prev) => ({ ...prev, [batchId]: "loading" }));
      await fetch(`/api/crawl/action/trans/${batchId}`);
      setTransLoading((prev) => ({ ...prev, [batchId]: "completed" }));
      message.success("数据迁移成功");

      await updateTransStatus(batchId);
    },
    {
      manual: true,
      onError: (error, params) => {
        console.log(error);
        message.error("数据迁移失败");
        setTransLoading((prev) => ({ ...prev, [params[0]]: "failed" }));
      },
    }
  );

  const updateTransStatus = async (batchId) => {
    try {
      const response = await fetch("/api/crawl/action/trans/updateStatus", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batchId: batchId,
          transStatus: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update download status");
      }

      const result = await response.json();
      console.log("Tran status updated:", result);
    } catch (error) {
      console.error("Error updating download status:", error);
      message.error("更新下载状态失败");
    }
  };

  const exeTypeStatus = {
    temp: "手动执行",
    scheduled: "定时执行",
  };

  const renderTransButton = (transStatus, batchId) => {
    if (transLoading[batchId] === "loading") {
      return (
        <Button variant="secondary" size="sm" disabled>
          转换中...
        </Button>
      );
    }

    if (transStatus == 1 || transLoading[batchId] === "completed") {
      return (
        <ConfirmAlertDialog
          triggerText="已完成"
          title="确认重新迁移"
          description="该批次数据已经完成迁移。您确定要重新迁移吗？"
          onConfirm={() => handleTransData(batchId)}
        />
      );
    }

    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => handleTransData(batchId)}
      >
        转换数据
      </Button>
    );
  };

  return (
    <div className="overflow-x-auto dark:bg-gray-900 dark:text-white">
      <div className="flex items-center space-x-4 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDownloadData()}
          disabled={downloadLoading}
        >
          {downloadLoading ? "下载中..." : "开始下载"}
        </Button>
        <div className="flex-grow">
          <Progress value={downloadProcess?.percent} />
          <div className="flex justify-between mt-1 text-sm">
            <span>{downloadProcess?.percent?.toFixed(2)}%</span>
            <span>总量: {downloadProcess?.total_size_str}</span>
          </div>
        </div>
      </div>
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
          {data.map((row) => (
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
                {row.status === "running" ? (
                  <Chip color="danger" variant="dot">
                    {_.capitalize(row.status)}
                  </Chip>
                ) : (
                  <Chip color="success" variant="dot">
                    {_.capitalize(row.status)}
                  </Chip>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-row items-center space-x-2">
                  {renderTransButton(row.transStatus, row.batchId)}
                  <Link
                    href={`/home?batchId=${row.batchId}`}
                    className="flex items-center text-blue-500 hover:underline dark:text-blue-400"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    查看
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClawerTable;
