"use client";

import { Card } from "@radix-ui/themes";
import { Tabs, Tab } from "@nextui-org/react";
import { useState } from "react";
import CrawlerManager from "./CrawlerManager";
import ScrapedDataTab from "./ScrapedDataTab";
import MediaLinksTab from "./MediaLinksTab";
import MyContext from "./MyContext";

const Page = ({ searchParams }) => {
  const [sharedData, setSharedData] = useState({});

  return (
    <MyContext.Provider value={{ sharedData, setSharedData }}>
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
    </MyContext.Provider>
  );
};

export default Page;
