"use client";

import { useEffect, useState, useRef } from "react";
import { message } from "react-message-popup";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getSpiderLog, getSpiderStatus } from "@/app/actions/admin/crawl";

const ClawerLogView = ({ jobId }: { jobId: string }) => {
  const [jobLog, setJobLog] = useState<string>("");

  const getLogs = async (): Promise<void> => {
    if (!jobId) {
      message.error("jobId is empty");
      return;
    }

    const { data: logText, code } = await getSpiderLog(jobId);

    if (code === 200) {
      setJobLog(logText ?? "");
    } else {
      message.error("Failed to fetch spider log");
    }
  };

  const checkStatus = async (): Promise<boolean> => {
    try {
      const { data: status, code } = await getSpiderStatus(jobId);
      if (status === "finished") {
        // 在设置完成状态之前，再次获取日志
        await getLogs();
        return true;
      } else {
        await getLogs();
        return false;
      }
    } catch (error) {
      console.error("Error checking spider status:", error);
      return false;
    }
  };

  useEffect(() => {
    getLogs();
    const intervalId = setInterval(async () => {
      const finished = await checkStatus();
      if (finished) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [jobId]);

  return (
    <div>
      <SyntaxHighlighter language="text" style={vscDarkPlus} showLineNumbers>
        {jobLog}
      </SyntaxHighlighter>
    </div>
  );
};

export default ClawerLogView;
