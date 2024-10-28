export const dynamic = "force-dynamic";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrowsingHistoryChart } from "@/components/chart/BrowsingHistoryChart";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NumShowCard from "../components/NumShowCard";
import { getMoiveeAppStatistic } from "@/app/actions/admin/dashboard";
import { nanoid } from "nanoid";
import PrefixCodeTable from "./PrefixCodeTable/Index";
import ScriptListBox from "../components/ScriptListBox";
import ScheduleCrawlUrlTable from "./ScheduleCrawlUrlTable/Index";

const Page = async () => {
  const { data: statisticData, code, msg } = await getMoiveeAppStatistic();
  return (
    <>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid  auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {statisticData?.map((card, index) => (
              <NumShowCard
                key={nanoid()}
                progressValue={card.progressValue}
                progressLabel={card.progressLabel}
                additionalInfo={card.additionalInfo}
                num={card.num?.toString()}
                title={card.title}
              />
            ))}
          </div>
          <div className="grid grid-cols-1">
            <BrowsingHistoryChart />
          </div>
          <Tabs defaultValue="prefix">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="prefix">Code Prefix</TabsTrigger>
                <TabsTrigger value="schedule">Crawl Schedule</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="prefix">
              <PrefixCodeTable />
            </TabsContent>
            <TabsContent value="schedule">
              <ScheduleCrawlUrlTable />
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <Card>
            <div className="p-4">
              <ScriptListBox />
            </div>
          </Card>
        </div>
      </main>
    </>
  );
};

export default Page;
