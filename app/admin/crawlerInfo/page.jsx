"use client";

import { useRequest } from "ahooks";

import React, { useState } from "react";
import SearchSection from "./SearchSection";
import ClawerTable from "./ClawerTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ClawerInfoPage = () => {
  const [searchParams, setSearchParams] = useState({
    batchId: "",
    status: "",
    page: 1,
  });

  const fetchBatchInfo = async (params) => {
    const response = await fetch(`/api/crawl/batchInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data, error, loading } = useRequest(fetchBatchInfo, {
    defaultParams: [searchParams],
  });

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">爬虫信息</h1>
      <Card>
        <CardHeader>
          <CardTitle>搜索</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchSection onSearch={handleSearch} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>爬虫数据</CardTitle>
        </CardHeader>
        <CardContent>
          <ClawerTable data={data?.data || []} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClawerInfoPage;
