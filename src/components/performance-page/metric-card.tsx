import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export interface MetricCardProps {
  title: string;
  description: string;
  data: Array<Record<string, any>>;
  config: ChartConfig;
  dataKey: string;
  xAxisKey: string;
  trendingValue?: string;
  trendingDirection?: 'up' | 'down';
  footerText?: string;
}

export function MetricCard({
  title,
  description,
  data,
  config,
  dataKey,
  xAxisKey,
  trendingValue,
  trendingDirection = 'up',
  footerText,
}: MetricCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                left: -10,
                right: 30,
                bottom: 10,
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <XAxis
                dataKey={xAxisKey}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={0}
                tickFormatter={(value) => {
                  // Convert from "Monday, Apr 14" to "4/14" format
                  const months: Record<string, number> = {
                    "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6,
                    "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12
                  };
                  
                  try {
                    const parts = value.split(',');
                    if (parts.length > 1) {
                      const datePart = parts[1].trim(); // "Apr 14"
                      const [month, day] = datePart.split(' ');
                      return `${months[month]}/${day}`;
                    }
                  } catch (e) {
                    // Fall back to original value if parsing fails
                  }
                  return value;
                }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                domain={[0, 100]}
              />
              <Line
                dataKey={dataKey}
                type="monotone"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                dot={true}
                activeDot={{ r: 6, fill: "var(--color-chart-1)" }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
