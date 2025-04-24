import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, ChartConfig } from "@/components/ui/chart";

interface MetricCardProps {
  title: string;
  description?: string;
  data: Record<string, unknown>[];
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
}: MetricCardProps) {
  // Calculate statistics for the data
  const calculateStatistics = () => {
    if (!data || data.length === 0) {
      return { min: 0, max: 0, avg: 0, current: 0 };
    }

    const values = data.map(item => {
      const val = item[dataKey];
      return typeof val === 'number' ? val : 0;
    });

    const min = Math.min(...values);
    const max = Math.max(...values);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = sum / values.length;
    const current = values[values.length - 1] || 0;

    return { min, max, avg, current };
  };

  const stats = calculateStatistics();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        {data && data.length > 0 && (
          <div className="h-[200px]">
            <AreaChart
              data={data}
              index={xAxisKey}
              categories={[dataKey]}
              colors={[config[dataKey as keyof typeof config]?.color || "#10b981"]}
              valueFormatter={(value) => `${value}`}
              showLegend={false}
              showAnimation={true}

            />
          </div>
        )}
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Min</span>
            <span className="text-xl font-bold text-white">{stats.min}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Max</span>
            <span className="text-xl font-bold text-white">{stats.max}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Avg</span>
            <span className="text-xl font-bold text-white">{Math.round(stats.avg)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Current</span>
            <span className="text-xl font-bold text-white">{stats.current}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}