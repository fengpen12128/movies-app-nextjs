"use client";

import CrawlerManager from "./CrawlerManager";

interface PageProps {
  searchParams: {
    batchId: string;
  };
}

const Page: React.FC<PageProps> = ({ searchParams }) => {
  return (
    <div className="flex flex-col gap-4 pb-10">
      <CrawlerManager batchId={searchParams.batchId} />
    </div>
  );
};

export default Page;
