"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { getPrefixStatistics } from "@/app/actions/admin/dashboard";
import { useRequest } from "ahooks";
import { Spinner } from "@radix-ui/themes";
import { runCrawl } from "@/app/actions/admin/crawl";
import { message } from "react-message-popup";

const PrefixCodeTable: React.FC = () => {
  const { data, loading } = useRequest(getPrefixStatistics);
  const [searchTerm, setSearchTerm] = useState("");
  const [crawlingCodes, setCrawlingCodes] = useState<Set<string>>(new Set());
  const [jobId, setJobId] = useState<string | null>(null);

  const handleReCrawl = (code: string) => {
    setCrawlingCodes((prev) => new Set(prev).add(code));
    // // 模拟爬取过程
    // setTimeout(() => {
    //   setCrawlingCodes((prev) => {
    //     const newSet = new Set(prev);
    //     newSet.delete(code);
    //     return newSet;
    //   });
    //   console.log(`Re-crawling completed for code: ${code}`);
    // }, 10000); // 3秒后完成爬取

    let p = {
      url: `https://javdb.com/video_codes/${code}`,
      maxPage: 1,
      save: false,
    };

    runCrawl({ urls: [p] }).then((res) => {
      if (res.code !== 200) {
        message.error(res.msg || "爬取失败");
      }
      message.success(res?.data!.jobId);
      setJobId(res?.data!.jobId);
    });
  };

  const handleViewLog = (code: string) => {
    window.open(`/clawerLogView?jobId=${jobId}`, "_blank");
  };

  const prefixData = data?.data || [];

  const filteredPrefixData = useMemo(() => {
    return prefixData.filter((item) =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [prefixData, searchTerm]);

  return (
    <div>
      <Input
        type="text"
        placeholder="Search by code..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="h-[500px] overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-[500px]">
            <Spinner />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Index</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Num</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrefixData.length > 0 ? (
                filteredPrefixData.map((item, index) => (
                  <TableRow key={item.code}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {crawlingCodes.has(item.code) && (
                          <Spinner className="mr-2 inline-block text-red-500" />
                        )}
                        <Link
                          href={`/home?prefix=${item.code}` as any}
                          className={`hover:underline ${
                            crawlingCodes.has(item.code)
                              ? "text-red-500"
                              : "hover:text-blue-500"
                          }`}
                          target="_blank"
                        >
                          {item.code}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>{item.num}</TableCell>
                    <TableCell>{item.brand}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={
                          crawlingCodes.has(item.code) ? "secondary" : "outline"
                        }
                        className={
                          crawlingCodes.has(item.code)
                            ? "text-blue-600 hover:text-blue-700 "
                            : "text-muted-foreground"
                        }
                        onClick={() =>
                          crawlingCodes.has(item.code)
                            ? handleViewLog(item.code)
                            : handleReCrawl(item.code)
                        }
                      >
                        {crawlingCodes.has(item.code) ? "View Log" : "Re Crawl"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default PrefixCodeTable;
