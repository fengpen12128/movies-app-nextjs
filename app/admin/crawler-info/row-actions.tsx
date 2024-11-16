"use client";

import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import { CrawlerInfos } from "./schema";
import { useSpiderActions } from "@/app/hooks/useSpiderActions";
import { CrawlStatus } from "./schema";

interface RowActionsProps {
  row: CrawlerInfos;
}

export function RowActions({ row }: RowActionsProps) {
  const { batchNum, transStatus, crawlStatus, jobId } = row;
  const { transferringBatches, downloadingBatches, executeSpiderEndActions } =
    useSpiderActions();

  const handleDataTrans = (batchNum: string) =>
    executeSpiderEndActions(batchNum);

  // 转换中状态
  if (transferringBatches.includes(batchNum ?? "")) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          转换中...
        </Button>

        <Button
          onClick={() => {
            window.open(`/admin/logView?jobId=${jobId}`, "_blank");
          }}
          variant="outline"
          size="sm"
        >
          View Log
        </Button>
      </div>
    );
  }

  if (crawlStatus === CrawlStatus.FINISHED) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDataTrans(batchNum ?? "")}
        >
          转换数据
        </Button>

        <Button
          onClick={() => {
            window.open(`/admin/logView?jobId=${jobId}`, "_blank");
          }}
          variant="outline"
          size="sm"
        >
          View Log
        </Button>
      </>
    );
  }

  // 已转换状态
  if (transStatus === 1) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => {}}>
          重新转换
        </Button>

        <Link
          href={`/home?batchNum=${batchNum}`}
          className="flex items-center text-blue-500 hover:underline dark:text-blue-400"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Eye className="w-4 h-4 mr-1" />
          查看
        </Link>

        <Button
          onClick={() => {
            window.open(`/admin/logView?jobId=${jobId}`, "_blank");
          }}
          variant="outline"
          size="sm"
        >
          View Log
        </Button>
      </div>
    );
  }

  // 其他状态不显示任何操作按钮
  return null;
}
