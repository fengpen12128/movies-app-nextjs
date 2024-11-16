"use client";

import React, { useState } from "react";
import SearchSection from "./SearchSection";
import ClawerTable from "./ClawerTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ClawerInfoPage = () => {
  const [searchParams, setSearchParams] = useState({
    batchNum: "",
    status: "",
    page: 1,
  });

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Crawler Info</h1>
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
          <CardTitle>Crawler Data</CardTitle>
        </CardHeader>
        <CardContent>
          <ClawerTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClawerInfoPage;
