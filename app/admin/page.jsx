import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  File,
  Home,
  LineChart,
  ListFilter,
  Package,
  Package2,
  PanelLeft,
  Search,
  ShoppingCart,
  Users2,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NumShowCard from "./components/NumShowCard";
import { getMoiveeAppStatistic } from "../actions/admin/dashboard";
import { nanoid } from "nanoid";
import PrefixCodeTable from "./dashboard/PrefixCodeTable";
import ScriptListBox from "./components/ScriptListBox";
import { ScheduleCrawlUrlTable } from "./dashboard/ScheduleCrawlUrlTable";
const Page = async () => {
  const { data: statisticData, code, msg } = await getMoiveeAppStatistic();
  return (
    <>


      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {statisticData.map((card, index) => (
              <NumShowCard
                key={nanoid()}
                progressValue={card.progressValue}
                progressLabel={card.progressLabel}
                additionalInfo={card.additionalInfo}
                num={card.num}
                title={card.title}
              />
            ))}
          </div>
          <Tabs defaultValue="prefix">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="prefix">Code Prefix</TabsTrigger>
                <TabsTrigger value="schedule">Crawl Schedule</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1 text-sm"
                    >
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only">Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Fulfilled
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Declined
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Refunded
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 text-sm"
                >
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Export</span>
                </Button>
              </div>
            </div>
            <TabsContent value="prefix">
              <Card>
                <CardHeader className="px-7">
                  <CardTitle>Code Prefix</CardTitle>
                </CardHeader>
                <CardContent>
                  <PrefixCodeTable />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="schedule">
              <Card>
                <CardHeader className="px-7">
                  <CardTitle>Crawl Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScheduleCrawlUrlTable />
                </CardContent>
              </Card>
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
