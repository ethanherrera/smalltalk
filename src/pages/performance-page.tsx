import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/performance-page/metric-card';
import { ChartConfig } from '@/components/ui/chart';

const weeklyProgressData = [
  { date: "Monday, Apr 14", score: 20, vocabulary: 40, pronunciation: 60, fluency: 30 },
  { date: "Tuesday, Apr 15", score: 82, vocabulary: 75, pronunciation: 78, fluency: 80 },
  { date: "Wednesday, Apr 16", score: 79, vocabulary: 81, pronunciation: 84, fluency: 77 },
  { date: "Thursday, Apr 17", score: 87, vocabulary: 86, pronunciation: 89, fluency: 83 },
  { date: "Friday, Apr 18", score: 91, vocabulary: 89, pronunciation: 87, fluency: 88 },
  { date: "Saturday, Apr 19", score: 92, vocabulary: 92, pronunciation: 81, fluency: 86 },
  { date: "Sunday, Apr 20", score: 93, vocabulary: 95, pronunciation: 90, fluency: 91 },
];

const chartConfigs = {
  grammar: {
    score: {
      label: "Grammar Score",
      color: "hsl(var(--chart-1))",
    },
  },
  vocabulary: {
    vocabulary: {
      label: "Vocabulary Score",
      color: "hsl(var(--chart-2))",
    },
  },
  pronunciation: {
    pronunciation: {
      label: "Pronunciation Score",
      color: "hsl(var(--chart-3))",
    },
  },
  fluency: {
    fluency: {
      label: "Fluency Score",
      color: "hsl(var(--chart-4))",
    },
  }
} satisfies Record<string, ChartConfig>;

const PerformancePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 pb-32">
      <div className="sticky top-0 z-10 bg-background flex items-center gap-2 py-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/home')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Performance Metrics</h1>
      </div>
      <MetricCard 
        title="Grammar Score"
        description="Weekly Progress (Apr 14 - Apr 20, 2024)"
        data={weeklyProgressData}
        config={chartConfigs.grammar}
        dataKey="score"
        xAxisKey="date"
        trendingValue="8.2%"
        trendingDirection="up"
      />
      <MetricCard 
        title="Vocabulary Score"
        description="Weekly Progress (Apr 14 - Apr 20, 2024)"
        data={weeklyProgressData}
        config={chartConfigs.vocabulary}
        dataKey="vocabulary"
        xAxisKey="date"
        trendingValue="11.4%"
        trendingDirection="up"
      />
      <MetricCard 
        title="Pronunciation Score"
        description="Weekly Progress (Apr 14 - Apr 20, 2024)"
        data={weeklyProgressData}
        config={chartConfigs.pronunciation}
        dataKey="pronunciation"
        xAxisKey="date"
        trendingValue="4.8%"
        trendingDirection="up"
      />
      <MetricCard 
        title="Fluency Score"
        description="Weekly Progress (Apr 14 - Apr 20, 2024)"
        data={weeklyProgressData}
        config={chartConfigs.fluency}
        dataKey="fluency"
        xAxisKey="date"
        trendingValue="6.9%"
        trendingDirection="up"
      />
    </div>
  );
};

export default PerformancePage;
