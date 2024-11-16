"use client";

import CrawlerManager from "./CrawlerManager";

interface PageProps {
  searchParams: {
    batchNum: string;
  };
}

const Page: React.FC<PageProps> = ({ searchParams }) => {
  return (
    <div className="flex flex-col gap-4 pb-10">
      <CrawlerManager batchNum={searchParams.batchNum} />
    </div>
  );
};

export default Page;
