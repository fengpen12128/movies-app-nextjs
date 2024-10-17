"use client";

import { Card } from "@radix-ui/themes";
import { Tabs, Tab } from "@nextui-org/react";
import CrawlerManager from "./CrawlerManager";
import ScrapedDataTab from "./ScrapedDataTab";
import MediaLinksTab from "./MediaLinksTab";

interface PageProps {
  searchParams: {
    batchId: string;
  };
}

const Page: React.FC<PageProps> = ({ searchParams }) => {
  return (
    <div className="flex flex-col gap-4 pb-10">
      <CrawlerManager batchId={searchParams.batchId} />

      <Card>
        <Tabs aria-label="Options">
          <Tab key="data" title="Scraped Data">
            <ScrapedDataTab />
          </Tab>
          <Tab key="download" title="Data Download">
            <MediaLinksTab />
          </Tab>
        </Tabs>
      </Card>
    </div>
  );
};

export default Page;
