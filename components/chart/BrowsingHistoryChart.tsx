"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { getDashboardChartData } from "@/app/actions/admin/dashboard";
import { useRequest } from "ahooks";

export const description = "An interactive bar chart";

const chartConfig = {
  views: {
    label: "Daily Views Number",
  },
  broswerHistory: {
    label: "BrowserNum",
    color: "hsl(var(--chart-1))",
  },
  collectionHistory: {
    label: "CollectedNum",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function BrowsingHistoryChart() {
  const { data: response, loading } = useRequest(getDashboardChartData);
  const chartData = (response?.data as DashboardChartData) || {};

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("broswerHistory");

  const total = React.useMemo(
    () => ({
      broswerHistory: chartData?.browserHistory?.reduce(
        (acc, curr) => acc + curr.yData,
        0
      ),
      collectionHistory: chartData?.collectionHistory?.reduce(
        (acc, curr) => acc + curr.yData,
        0
      ),
    }),
    [chartData]
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Daily Views Number</CardTitle>
          <CardDescription>
            Showing total views for the last 1 year
          </CardDescription>
        </div>
        <div className="flex">
          {["broswerHistory", "collectionHistory"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData[activeChart as keyof DashboardChartData]}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="xData"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="xData"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey="yData" fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
