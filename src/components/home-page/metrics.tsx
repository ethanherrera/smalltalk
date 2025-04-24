import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface Metric {
  title: string;
  value: string;
  trend: string;
}

export function Metrics() {
  // Changed to useState and removed the unused setter
  const metrics = useState<Metric[]>([
    { title: 'Total Sessions', value: '37', trend: '+13%' },
    { title: 'Time Practiced', value: '12h 24m', trend: '+5%' },
    { title: 'Current Streak', value: '8 days', trend: '+2' },
  ])[0];

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Your Stats</h2>
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold text-white">{metric.value}</div>
                <div className="text-sm text-green-500 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {metric.trend}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Metrics;