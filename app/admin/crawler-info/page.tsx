"use client";

import CrawlerInfoTable from "./CrawlerInfoTable";
import CrawlerManager from "./CrawlerManager";

export default function TaskPage() {
  return (
    <div className="h-[calc(100vh-4rem)] px-12 ">
      {/* 将 flex-col 改为 flex-row */}
      <div className="h-full flex flex-row gap-4">
        {/* 使用 w-1/3 设置宽度为 1/3 */}
        <div className="w-[40%]">
          <CrawlerManager />
        </div>
        <div className="w-[60%]">
          <CrawlerInfoTable />
        </div>
      </div>
    </div>
  );
}
