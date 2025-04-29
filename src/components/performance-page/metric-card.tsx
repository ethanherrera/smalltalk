import React from "react";
import { useState } from "react";

import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Button } from "../ui/button";
export interface MetricCardProps {
  title: string;
  description: string;
  data: Array<Record<string, any>>;
  config: ChartConfig;
  dataKey: string;
  xAxisKey: string;
  trendingValue?: string;
  trendingDirection?: "up" | "down";
  footerText?: string;
}

var subset = [];

function sliceWithStep(array, start = 0, end = array.length, step = 1) {
  const result = [];
  for (let i = start; i < end; i += step) {
    result.push(array[i]);
  }
  return result;
}

export function MetricCard({
  title,
  description,
  data,
  config,
  dataKey,
  xAxisKey,
  trendingValue,
  trendingDirection = "up",
  footerText,
}: MetricCardProps) {
  const [trueData, setGraphData] = useState(Array<Record<string, any>>());
  const [xaxis_type, setXAxisType] = useState("");
  const [isClicked, setIsClicked] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="inline-block align-middle flex justify-between">
          <Button
            variant="outline"
            className={"w-5 " + (isClicked[0] == true ? "bg-purple-700" : "")}
            onClick={() => {
              setGraphData(data.slice(data.length - 7, data.length));
              setXAxisType("day");
              isClicked.fill(false);
              isClicked[0] = true;
            }}
          >
            1W
          </Button>
          <Button
            variant="outline"
            className={"w-5 " + (isClicked[1] == true ? "bg-purple-700" : "")}
            onClick={() => {
              setGraphData(
                sliceWithStep(data, data.length - 30, data.length, 2)
              );
              setXAxisType("day");
              isClicked.fill(false);
              isClicked[1] = true;
            }}
          >
            1M
          </Button>
          <Button
            variant="outline"
            className={"w-5 " + (isClicked[2] == true ? "bg-purple-700" : "")}
            onClick={() => {
              setGraphData(
                sliceWithStep(data, data.length - 90, data.length, 4)
              );
              setXAxisType("month");
              isClicked.fill(false);
              isClicked[2] = true;
            }}
          >
            3M
          </Button>
          <Button
            variant="outline"
            className={"w-5 " + (isClicked[3] == true ? "bg-purple-700" : "")}
            onClick={() => {
              setGraphData(
                sliceWithStep(data, data.length - 180, data.length, 8)
              );
              setXAxisType("month");
              isClicked.fill(false);
              isClicked[3] = true;
            }}
          >
            6M
          </Button>
          <Button
            variant="outline"
            className={"w-5 " + (isClicked[4] == true ? "bg-purple-700" : "")}
            onClick={() => {
              setGraphData(
                sliceWithStep(data, data.length - 365, data.length, 16)
              );
              setXAxisType("month");
              isClicked.fill(false);
              isClicked[4] = true;
            }}
          >
            1Y
          </Button>
          <Button
            variant="outline"
            className={"w-5 " + (isClicked[5] == true ? "bg-purple-700" : "")}
            onClick={() => {
              setGraphData(
                sliceWithStep(data, data.length - 365 * 2, data.length, 32)
              );
              setXAxisType("year");
              isClicked.fill(false);
              isClicked[5] = true;
            }}
          >
            2Y
          </Button>
          <Button
            variant="outline"
            className={"w-5 " + (isClicked[6] == true ? "bg-purple-700" : "")}
            onClick={() => {
              setGraphData(sliceWithStep(data, 0, data.length, 32));
              setXAxisType("year");
              isClicked.fill(false);
              isClicked[6] = true;
            }}
          >
            All
          </Button>
        </div>
        <ChartContainer config={config}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              accessibilityLayer
              data={trueData}
              margin={{
                left: -10,
                right: 30,
                bottom: 10,
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <XAxis
                dataKey={xaxis_type}
                type="category"
                allowDuplicatedCategory={false}
                tickLine={false}
                axisLine={false}
                xAxisId={1}
                tickFormatter={(value) => {
                  if (xaxis_type == "month") {
                    return months[value];
                  }
                  return value;
                }}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={0}
                tick={false}
              />
              <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
              <Line
                dataKey={dataKey}
                type="monotone"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: "var(--color-chart-1)" }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
