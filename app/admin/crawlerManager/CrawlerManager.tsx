import React, { useEffect } from "react";
import {
  TextField,
  Button,
  Card,
  Text,
  ScrollArea,
  Badge,
} from "@radix-ui/themes";
import {
  Plus,
  Trash2,
  Play,
  StopCircle,
  FileText,
  Calendar,
} from "lucide-react";
import { DataList } from "@radix-ui/themes";
import { message } from "react-message-popup";
import ClawerLogView from "@/app/clawerLogView/ClawerLogView";
import { Accordion, AccordionItem } from "@nextui-org/react";
import AlertDialogCommon from "@/components/radix/AlertDialog";
import { useCrawlTargets } from "@/app/hooks/useCrawlTargets";
import { useSpiderActions } from "@/app/hooks/useSpiderActions";
import { useCrawlerOperations } from "@/app/hooks/useCrawlerOperations";
import {
  getCrawlRecordByBatchId,
  getCrawlScheduledUrls,
} from "@/app/actions/admin/crawl";

interface CrawlerManagerProps {
  batchId: string;
}

const CrawlerManager: React.FC<CrawlerManagerProps> = ({ batchId }) => {
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
    const {
      data: crawlStat,
      code,
      msg,
    } = await getCrawlRecordByBatchId(batchId);

    if (code !== 200 || !crawlStat) {
      message.error(msg!);
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
      <div className="flex flex-col gap-2 mb-10">
        <Text size="8" weight="bold">
          Crawler Manager
        </Text>
        <Text size="2" color="gray">
          Control and monitor your web crawler
        </Text>
      </div>
      {targets.map((target, index) => (
        <div key={index} className="flex space-x-4 mb-4 items-center">
          <TextField.Root
            size="3"
            value={target.url}
            onChange={(e) => updateTarget(index, "url", e.target.value)}
            radius="medium"
            placeholder="Enter URL to crawl"
            className="flex-grow"
            disabled={crawlState.status === "running" || !!batchId}
          />
          <TextField.Root
            size="3"
            value={target.maxPage || ""}
            onChange={(e) => {
              const value = e.target.value;
              const parsedValue = value === "" ? "" : parseInt(value, 10);
              updateTarget(index, "maxPage", parsedValue);
            }}
            radius="medium"
            placeholder="Max pages"
            className="w-32"
            disabled={crawlState.status === "running" || !!batchId}
          />
          {crawlState.status === "idle" && (
            <Button
              onClick={() => removeTarget(index)}
              disabled={targets.length === 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <div
          className="flex gap-2"
          style={{
            visibility:
              crawlState.status === "running" || !!batchId
                ? "hidden"
                : "visible",
          }}
        >
          <Button onClick={addTarget} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add URL
          </Button>
          <Button onClick={() => handleFetchScheduledUrls()} variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Fetch Scheduled
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={
              crawlState.status === "running"
                ? stopCrawling
                : handleStartCrawling
            }
            color={crawlState.status === "running" ? "red" : "green"}
            disabled={
              transferringBatches.length > 0 || downloadingBatches.length > 0
            }
          >
            {crawlState.status === "running" ? (
              <>
                <StopCircle className="mr-1 h-4 w-4" />
                Stop Crawling
              </>
            ) : transferringBatches.length > 0 ? (
              <>
                <FileText className="mr-1 h-4 w-4" />
                Trans Data...
              </>
            ) : downloadingBatches.length > 0 ? (
              <>
                <FileText className="mr-1 h-4 w-4" />
                Media Downloading...
              </>
            ) : (
              <>
                <Play className="mr-1 h-4 w-4" />
                Start Crawling
              </>
            )}
          </Button>
          <Button
            disabled={!crawlState.jobId}
            color="cyan"
            onClick={handleViewLogs}
          >
            <FileText className="mr-1 h-4 w-4" />
            View Logs
          </Button>
        </div>
      </div>

      <Card className="mt-4 space-x-6">
        <DataList.Root>
          <DataList.Item>
            <DataList.Label minWidth="88px">Status</DataList.Label>
            <DataList.Value>
              <Badge color={crawlState.status === "running" ? "red" : "green"}>
                {crawlState.status}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Timing</DataList.Label>
            <DataList.Value></DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">JobId</DataList.Label>
            <DataList.Value>{crawlState.jobId}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">BatchId</DataList.Label>
            <DataList.Value>{crawlState.batchId}</DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </Card>

      {crawlState.status === "running" && (
        <Accordion variant="splitted" className="mt-4">
          <AccordionItem
            key="1"
            aria-label="Accordion 1"
            title={
              <>
                <FileText className="inline-block mr-2 h-4 w-4" />
                <Text size="4" weight="bold" className="mb-2">
                  Crawl Logs
                </Text>
              </>
            }
          >
            <ScrollArea
              type="always"
              scrollbars="vertical"
              style={{ height: 500 }}
            >
              {crawlState.jobId && <ClawerLogView jobId={crawlState.jobId} />}
            </ScrollArea>
          </AccordionItem>
        </Accordion>
      )}

      <AlertDialogCommon
        isOpen={showStopDialog}
        onOpenChange={setShowStopDialog}
        confirmAction={confirmStopCrawling}
        title="确认停止"
        description="您确定要停止爬虫吗？此操作无法撤销。"
        actionText="停止"
      />
    </Card>
  );
};

export default CrawlerManager;
