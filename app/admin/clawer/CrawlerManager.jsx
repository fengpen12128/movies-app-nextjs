import { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  Card,
  Text,
  ScrollArea,
  Badge,
} from "@radix-ui/themes";
import { Plus, Trash2, Play, StopCircle, FileText } from "lucide-react";
import { AlertDialog, Button as RadixButton, DataList } from "@radix-ui/themes";
import { message } from "react-message-popup";
import ClawerLogView from "@/app/clawerLogView/ClawerLogView";
import { Accordion, AccordionItem } from "@nextui-org/react";
import MyContext from "./MyContext";
import { useRequest } from "ahooks";

const CrawlerManager = ({ batchId }) => {
  const [crawlTargets, setCrawlTargets] = useState([{ url: "", maxPages: 1 }]);
  const [crawlStatus, setCrawlStatus] = useState("idle");
  const [batchNumber, setBatchNumber] = useState(null);
  const [jobId, setJobId] = useState("");
  const [crawlTime, setCrawlTime] = useState(0);
  const [crawlTimer, setCrawlTimer] = useState(null);
  const [showStopDialog, setShowStopDialog] = useState(false);
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);
  const { sharedData, setSharedData } = useContext(MyContext);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const { runAsync: handleDownloadData } = useRequest(
    async () => {
      await fetch(`/api/crawl/action/download/${batchNumber}?mode=sync`);
    },
    {
      manual: true,
    }
  );

  const { runAsync: handleTransData } = useRequest(
    async () => {
      await fetch(`/api/crawl/action/trans/${batchNumber}`);
      message.success("数据迁移成功");

      // 调用新的 API 接口来更新 downloadStatus
      await updateTransStatus(batchNumber);
    },
    {
      manual: true,
      onError: (error) => {
        console.log(error);
        message.error("数据迁移失败");
      },
    }
  );

  const updateTransStatus = async (batchNumber) => {
    try {
      const response = await fetch("/api/crawl/action/trans/updateStatus", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batchId: String(batchNumber),
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

  const { data: batchInfo, run: fetchBatchInfo } = useRequest(
    async () => {
      const response = await fetch(`/api/crawl/batchInfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ batchId }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch batch info");
      }
      const res = await response.json();
      return res?.data.crawlParams;
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    console.log("batchId in useEffect is ", batchId);
    if (batchId) {
      fetchBatchInfo();
    }
  }, [batchId, fetchBatchInfo]);

  useEffect(() => {
    console.log("batchInfo", batchInfo);

    if (batchInfo) {
      setCrawlStatus(batchInfo.status || "idle");
      setBatchNumber(batchInfo.batch_id);
      setSharedData({ ...sharedData, batchNum: batchInfo.batch_id });
      setJobId(batchInfo._job || "");
      const params = JSON.parse(batchInfo.urls);
      setCrawlTargets(
        params.map((param) => ({ url: param[0], maxPages: param[1] }))
      );
    }
  }, [batchInfo]);

  const addCrawlTarget = () => {
    setCrawlTargets([...crawlTargets, { url: "", maxPages: "" }]);
  };

  const removeCrawlTarget = (index) => {
    const newTargets = crawlTargets.filter((_, i) => i !== index);
    setCrawlTargets(newTargets);
  };

  const updateCrawlTarget = (index, field, value) => {
    const newTargets = [...crawlTargets];
    newTargets[index][field] = value;
    setCrawlTargets(newTargets);
  };

  const startCrawling = async () => {
    setCrawlStatus("running");
    setCrawlTime(0);

    const timer = setInterval(() => {
      setCrawlTime((prevTime) => prevTime + 1);
    }, 1000);
    setCrawlTimer(timer);

    const handleCrawlParams = () => {
      return {
        urls: crawlTargets.map(({ url, maxPages }) => [url, maxPages]),
      };
    };

    try {
      const response = await fetch("http://localhost:8001/run-spider", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(handleCrawlParams()),
      });

      const res = await response.json();
      setJobId(res.jobId);
      setBatchNumber(res.batchId);
      setSharedData({ ...sharedData, batchNum: res.batchId });
      // Start checking spider status
      const statusInterval = setInterval(
        () => checkSpiderStatus(res.jobId),
        1000
      );
      setStatusCheckInterval(statusInterval);
    } catch (err) {
      console.error("Error:", err);
      message.error("Failed to start spider");
    }
  };

  const checkSpiderStatus = async (jobId) => {
    try {
      const response = await fetch(
        `http://localhost:8001/spider-status/${jobId}`
      );
      const data = await response.json();

      if (data.status === "finished") {
        setCrawlStatus("completed");
        if (statusCheckInterval) {
          clearInterval(statusCheckInterval);
          setStatusCheckInterval(null);
        }
        clearInterval(crawlTimer);
        setCrawlTimer(null);
        message.success("Crawling completed");
        console.log("Crawling completed");

        // 爬虫完成后自动调用 handleTransData，然后调用 handleDownloadData
        setIsTransferring(true);
        await handleTransData();
        setIsTransferring(false);

        setIsDownloading(true);
        await handleDownloadData();
        setIsDownloading(false);
      }

      //   if (data.logs) {
      //     setCrawlLogs((prevLogs) => prevLogs + data.logs);
      //   }
    } catch (err) {
      console.error("Error checking spider status:", err);
    }
  };

  const stopCrawling = () => {
    setShowStopDialog(true);
  };

  const confirmStopCrawling = () => {
    setCrawlStatus("idle");
    if (crawlTimer) {
      clearInterval(crawlTimer);
      setCrawlTimer(null);
    }
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
      setStatusCheckInterval(null);
    }
    setShowStopDialog(false);
  };

  useEffect(() => {
    return () => {
      if (crawlTimer) {
        clearInterval(crawlTimer);
      }
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [crawlTimer, statusCheckInterval]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleViewLogs = () => {
    if (!jobId) {
      message.error("任务未开始");
      return;
    }

    window.open(`/clawerLogView?jobId=${jobId}`, "_blank");
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
      {crawlTargets.map((target, index) => (
        <div key={index} className="flex space-x-4 mb-4 items-center">
          <TextField.Root
            size="3"
            value={target.url}
            onChange={(e) => updateCrawlTarget(index, "url", e.target.value)}
            radius="medium"
            placeholder="Enter URL to crawl"
            className="flex-grow"
          />
          <TextField.Root
            size="3"
            value={target.maxPages}
            onChange={(e) =>
              updateCrawlTarget(index, "maxPages", e.target.value)
            }
            radius="medium"
            placeholder="Max pages"
            className="w-32"
          />
          <Button
            variant="destructive"
            size="icon"
            onClick={() => removeCrawlTarget(index)}
            disabled={crawlTargets.length === 1}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {/* 按钮区域 */}
      <div className="flex justify-between mt-4">
        <Button onClick={addCrawlTarget} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add URL
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={crawlStatus === "running" ? stopCrawling : startCrawling}
            color={crawlStatus === "running" ? "red" : "green"}
            disabled={isTransferring || isDownloading}
          >
            {crawlStatus === "running" ? (
              <>
                <StopCircle className="mr-1 h-4 w-4" />
                Stop Crawling
              </>
            ) : isTransferring ? (
              <>
                <FileText className="mr-1 h-4 w-4" />
                Trans Data...
              </>
            ) : isDownloading ? (
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
          <Button disabled={!jobId} color="cyan" onClick={handleViewLogs}>
            <FileText className="mr-1 h-4 w-4" />
            View Logs
          </Button>
        </div>
      </div>

      {/* 信息区域 */}
      <Card className="mt-4 space-x-6">
        <DataList.Root>
          <DataList.Item>
            <DataList.Label minWidth="88px">Status</DataList.Label>
            <DataList.Value>
              <Badge color={crawlStatus === "running" ? "red" : "green"}>
                {crawlStatus}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">JobId</DataList.Label>
            <DataList.Value>{jobId}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">BatchNumber</DataList.Label>
            <DataList.Value>{batchNumber}</DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </Card>

      {/* 日志区域 */}
      {crawlStatus !== "idle" && (
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
              {jobId && <ClawerLogView jobId={jobId} />}
            </ScrollArea>
          </AccordionItem>
        </Accordion>
      )}

      <AlertDialog.Root open={showStopDialog} onOpenChange={setShowStopDialog}>
        <AlertDialog.Content>
          <AlertDialog.Title>Confirm Stop Crawling</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to stop the crawling process? This action
            cannot be undone.
          </AlertDialog.Description>
          <div className="flex justify-end gap-3 mt-4">
            <AlertDialog.Cancel>
              <RadixButton variant="soft" color="gray">
                Cancel
              </RadixButton>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <RadixButton
                variant="solid"
                color="red"
                onClick={confirmStopCrawling}
              >
                Stop Crawling
              </RadixButton>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Card>
  );
};

export default CrawlerManager;
