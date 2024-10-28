import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Trash2,
  Play,
  StopCircle,
  FileText,
  Calendar,
} from "lucide-react";
import { message } from "react-message-popup";
import ClawerLogView from "@/app/admin/logView/ClawerLogView";
import { Accordion, AccordionItem } from "@nextui-org/react";
import AlertDialogCommon from "@/components/radix/AlertDialog";
import { useCrawlTargets } from "@/app/hooks/useCrawlTargets";
import { useSpiderActions } from "@/app/hooks/useSpiderActions";
import { useCrawlerOperations } from "@/app/hooks/useCrawlerOperations";
import {
  getCrawlRecordByBatchId,
  getCrawlScheduledUrls,
} from "@/app/actions/admin/crawl";
import { useQueryClient } from "@tanstack/react-query";

// 添加一个简单的 Label 组件
const Label = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
  >
    {children}
  </div>
);

// 添加一个简单的 DataList 组件替代
const DataListItem = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center py-2">
    <div className="min-w-[88px] font-medium">{label}</div>
    <div>{children}</div>
  </div>
);

interface CrawlerManagerProps {
  batchId?: string;
}

const CrawlerManager: React.FC<CrawlerManagerProps> = ({ batchId }) => {
  const queryClient = useQueryClient();
  const { targets, addTarget, removeTarget, updateTarget, setAllTargets } =
    useCrawlTargets();

  const { transferringBatches, downloadingBatches, executeSpiderEndActions } =
    useSpiderActions();

  const {
    startCrawling,
    crawlState,
    showStopDialog,
    setCrawlState,
    intervalCheckSpiderStatus,
    setShowStopDialog,
    stopCrawling,
    confirmStopCrawling,
  } = useCrawlerOperations(
    { status: "idle", batchId: null, jobId: "" },
    targets
  );

  const getCrawlParamsAndStatus = async () => {
    if (!batchId) return; // 添加空值检查

    const {
      data: crawlStat,
      code,
      msg,
    } = await getCrawlRecordByBatchId(batchId);

    if (code !== 200 || !crawlStat) {
      message.error(msg || "获取爬虫状态失败"); // 提供默认错误消息
      return;
    }

    setCrawlState((prevState) => ({
      ...prevState,
      status: crawlStat.crawlStatus ?? "idle",
      batchId: crawlStat.batchId ?? null,
      jobId: crawlStat.jobId ?? "",
    }));
    setAllTargets(crawlStat.urls || []);
    if (crawlStat.crawlStatus === "running") {
      intervalCheckSpiderStatus(
        crawlStat.jobId,
        executeSpiderEndActions,
        crawlStat.batchId
      );
    }
  };

  useEffect(() => {
    if (batchId) {
      getCrawlParamsAndStatus();
    }
  }, [batchId]);

  const handleViewLogs = () => {
    if (!crawlState.jobId) {
      message.error("任务未开始");
      return;
    }
    window.open(`/clawerLogView?jobId=${crawlState.jobId}`, "_blank");
  };

  const handleFetchScheduledUrls = async () => {
    const { data: scheduledUrls, code, msg } = await getCrawlScheduledUrls();
    if (code !== 200 || !scheduledUrls) {
      message.error(msg!);
      return;
    }
    setAllTargets(scheduledUrls);
  };

  const handleStartCrawling = async () => {
    await startCrawling(executeSpiderEndActions);
  };

  return (
    <Card>
      <CardContent className="max-h-screen py-3 flex flex-col overflow-auto">
        <div className="flex flex-col gap-2 mb-6">
          <p className="text-sm text-muted-foreground">
            Control and monitor your web crawler
          </p>
        </div>

        <div className="pr-4">
          {targets.map((target, index) => (
            <div key={index} className="flex space-x-4 mb-4 items-center">
              <Input
                value={target.url}
                onChange={(e) => updateTarget(index, "url", e.target.value)}
                placeholder="Enter URL to crawl"
                className="flex-grow"
                disabled={crawlState.status === "running" || !!batchId}
              />
              <Input
                value={target.maxPage || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  const parsedValue = value === "" ? "" : parseInt(value, 10);
                  updateTarget(index, "maxPage", parsedValue);
                }}
                placeholder="Max pages"
                className="w-32"
                disabled={crawlState.status === "running" || !!batchId}
              />
              <Checkbox
                checked={target.save}
                onCheckedChange={(checked) =>
                  updateTarget(index, "save", checked as boolean)
                }
              />
              {crawlState.status === "idle" && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeTarget(index)}
                  disabled={targets.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="flex justify-between">
            <div
              className="flex gap-2"
              style={{
                visibility:
                  crawlState.status === "running" || !!batchId
                    ? "hidden"
                    : "visible",
              }}
            >
              <Button size="sm" variant="outline" onClick={addTarget}>
                <Plus className="mr-2 h-3 w-3" />
                Add URL
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleFetchScheduledUrls}
              >
                <Calendar className="mr-2 h-3 w-3" />
                Fetch Scheduled
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={
                  crawlState.status === "running" ? "destructive" : "default"
                }
                onClick={
                  crawlState.status === "running"
                    ? stopCrawling
                    : handleStartCrawling
                }
                disabled={
                  transferringBatches.length > 0 ||
                  downloadingBatches.length > 0
                }
              >
                {crawlState.status === "running" ? (
                  <>
                    <StopCircle className="mr-1 h-3 w-3" />
                    Stop Crawling
                  </>
                ) : transferringBatches.length > 0 ? (
                  <>
                    <FileText className="mr-1 h-3 w-3" />
                    Trans Data...
                  </>
                ) : downloadingBatches.length > 0 ? (
                  <>
                    <FileText className="mr-1 h-3 w-3" />
                    Media Downloading...
                  </>
                ) : (
                  <>
                    <Play className="mr-1 h-3 w-3" />
                    Start Crawling
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={!crawlState.jobId}
                onClick={handleViewLogs}
              >
                <FileText className="mr-1 h-3 w-3" />
                View Logs
              </Button>
            </div>
          </div>

          <Card className="mt-4">
            <CardContent className="pt-6">
              <DataListItem label="Status">
                <Badge
                  variant={
                    crawlState.status === "running" ? "destructive" : "default"
                  }
                >
                  {crawlState.status}
                </Badge>
              </DataListItem>
              <DataListItem label="Timing">
                <span></span>
              </DataListItem>
              <DataListItem label="JobId">
                <span>{crawlState.jobId}</span>
              </DataListItem>
              <DataListItem label="BatchId">
                <span>{crawlState.batchId}</span>
              </DataListItem>
            </CardContent>
          </Card>

          {crawlState.status === "running" && (
            <Accordion variant="splitted" className="mt-4">
              <AccordionItem
                key="1"
                aria-label="Accordion 1"
                title={
                  <>
                    <FileText className="inline-block mr-2 h-4 w-4" />
                    <span className="text-base font-semibold">Crawl Logs</span>
                  </>
                }
              >
                <ScrollArea className="h-[40vh]">
                  {crawlState.jobId && (
                    <ClawerLogView jobId={crawlState.jobId} />
                  )}
                </ScrollArea>
              </AccordionItem>
            </Accordion>
          )}
        </div>

        <AlertDialogCommon
          isOpen={showStopDialog}
          onOpenChange={setShowStopDialog}
          confirmAction={confirmStopCrawling}
          title="确认停止"
          description="您确定要停止爬虫吗？此操作无法撤销。"
          actionText="停止"
        />
      </CardContent>
    </Card>
  );
};

export default CrawlerManager;
