"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getUnDownloadImageNum } from "@/app/actions/admin/crawl/index";
import { useEffect } from "react";

interface DownloadProgress {
  total: number;
  completed: number;
  success: number;
  failed: number;
  percent: number;
}

const DownloadCard = () => {
  const [downloading, setDownloading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPendingCount = async () => {
      const result = await getUnDownloadImageNum();
      setPendingCount(result.data || 0);
    };

    fetchPendingCount();
  }, []);

  const refetch = async () => {
    const result = await getUnDownloadImageNum();
    setPendingCount(result.data || 0);
  };

  // 获取下载进度
  const { data: progress } = useQuery<DownloadProgress, Error>({
    queryKey: ["downloadProgress"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SCRIPT_BACKEND_ENDPOINT}/download-progress`
      );
      if (!response.ok) throw new Error("Failed to fetch progress");
      const data = await response.json();

      // 计算实际的进度百分比
      const calculatedProgress = {
        ...data,
        percent: data.total > 0 ? (data.completed / data.total) * 100 : 0,
      };

      // 在这里处理下载完成的逻辑
      if (
        calculatedProgress.completed === calculatedProgress.total &&
        calculatedProgress.total > 0
      ) {
        setDownloading(false);
        refetch();
      }

      return calculatedProgress;
    },
    enabled: downloading,
    refetchInterval: downloading ? 1000 : false,
  });

  // 开始下载的mutation
  const startDownloadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SCRIPT_BACKEND_ENDPOINT}/start-download-async`
      );
      if (!response.ok) throw new Error("Failed to start download");
      return response.json();
    },
    onSuccess: () => {
      setDownloading(true);
    },
    onError: (error) => {
      console.error("Failed to start download:", error);
      setDownloading(false);
    },
  });

  const handleDownload = () => {
    startDownloadMutation.mutate();
  };

  // 计算进度条的值（确保在0-100之间）
  const progressValue = progress
    ? Math.min(Math.max(progress.percent, 0), 100)
    : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>下载中心</CardTitle>
        <Badge variant="secondary">待下载: {pendingCount}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            onClick={handleDownload}
            disabled={downloading || pendingCount === 0}
            className="w-full"
          >
            {downloading
              ? "下载中..."
              : pendingCount === 0
              ? "无待下载项"
              : "开始下载"}
          </Button>

          {downloading && progress && (
            <div className="space-y-2">
              <Progress value={progressValue} />
              <div className="text-sm text-center text-muted-foreground space-y-1">
                <p>{progressValue.toFixed(1)}%</p>
                <p>
                  总数: {progress.total} | 已完成: {progress.completed} | 成功:{" "}
                  {progress.success} | 失败: {progress.failed}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadCard;
