"use client";

import { useState, useContext, useEffect } from "react";
import { useRequest } from "ahooks";
import { Card, Text, IconButton } from "@radix-ui/themes";
import { RefreshCw } from "lucide-react";
import { Pagination } from "@nextui-org/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import useCrawlStore from "@/store/crawlStore";

const ScrapedDataTab = () => {
  const { batchId } = useCrawlStore();
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data,
    loading,
    run: getScrapedData,
  } = useRequest(
    async () => {
      if (!batchId) {
        return null;
      }
      const res = await fetch(
        `/api/crawl/data/crawlData/${batchId}?page=${currentPage}`,
        {
          cache: "no-store",
        }
      );
      return await res.json();
    },
    {
      refreshDeps: [currentPage, batchId],
    }
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="relative ">
      <div className="p-4 ">
        <div className="absolute top-4 right-4">
          <IconButton onClick={getScrapedData} variant="ghost">
            <RefreshCw width="18" height="18" />
          </IconButton>
        </div>

        <div className="max-h-[90vh] overflow-y-auto">
          {data?.data?.map((item, index) => (
            <div key={item.id} className="mb-2 pb-2">
              <Text size="3" weight="bold" className="mb-2">
                {item.data?.code}
              </Text>
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                showLineNumbers
              >
                {JSON.stringify(item.data, null, 2)}
              </SyntaxHighlighter>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-4">
          {data?.pagination && (
            <Pagination
              onChange={(page) => handlePageChange(page)}
              page={currentPage}
              total={data?.pagination.totalPage}
              initialPage={1}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrapedDataTab;
