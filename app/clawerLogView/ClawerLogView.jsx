"use client";

import { useEffect, useState, useRef } from "react";
import { message } from "react-message-popup";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
const ClawerLogView = ({ jobId }) => {
  const [jobLog, setJobLog] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const logContainerRef = useRef(null);

  const getLogs = async () => {
    console.log("jobId is ", jobId);
    if (!jobId) {
      message.error("jobId is empty");
      return;
    }

    const res = await fetch(`http://localhost:8001/spider-log/${jobId}`, {
      cache: "no-store",
    });
    const data = await res.text();
    setJobLog(data);
  };

  const checkStatus = async () => {
    try {
      const res = await fetch(`http://localhost:8001/spider-status/${jobId}`);
      const status = await res.json();
      if (status.status === "finished") {
        // 在设置完成状态之前，再次获取日志
        await getLogs();
        setIsFinished(true);
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

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [jobLog]);

  return (
    <div>
      {/* <div className="text-lg font-semibold">{jobId}</div> */}
      <SyntaxHighlighter language="text" style={vscDarkPlus} showLineNumbers>
        {jobLog}
      </SyntaxHighlighter>

      {/* <pre
        ref={logContainerRef}
        // className="max-h-screen overflow-y-auto transition-all duration-300 ease-in-out p-4 rounded-lg font-mono whitespace-pre-wrap break-words scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
        className="max-h-screen overflow-y-auto"
      >
        {jobLog}
      </pre> */}
      {/* {isFinished && (
        <div className="text-green-600 font-semibold animate-fade-in">
          爬虫任务已完成
        </div>
      )} */}
    </div>
  );
};

export default ClawerLogView;
