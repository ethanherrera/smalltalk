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

export function MetricCardCondensed({
  title,
  description,
  data,
  config,
  dataKey,
  xAxisKey,
  trendingValue,
  trendingDirection = "up",
  footerText,
  onClick,
}: MetricCardProps) {
  return (
    <Card className="h-20" onClick={onClick}>
      <CardContent className="inline-block align-middle text-left flex justify-between">
        <div className="w-25"> {title} </div>
        <ChartContainer config={config} className="w-20 h-10">
          <LineChart accessibilityLayer data={data}>
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
        </ChartContainer>
        <div> {data[0][dataKey] + 10} </div>
      </CardContent>
    </Card>
  );
}
