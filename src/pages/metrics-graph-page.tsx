import React from 'react';
import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/performance-page/metric-card';
import { ChartConfig } from '@/components/ui/chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


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

const MectricsGraphPage: React.FC = (state: any) => {
  const navigate = useNavigate();

  var config;
  var dataKey;
  var type = state.state.metric_type;

  if (type == "Grammar") {
    config = chartConfigs.grammar;
    dataKey = "score";
  } else if (type == "Vocabulary") {
    config = chartConfigs.vocabulary;
    dataKey = "vocabulary";
  } else if (type == "Fluency") {
    config = chartConfigs.fluency;
    dataKey = "fluency";
  } else if (type == "Pronunciation") {
    config = chartConfigs.pronunciation;
    dataKey = "pronunciation";
  } else {
    config = chartConfigs.pronunciation;
    dataKey = "pronunciation";
  }

  return (
    <div className="flex flex-col gap-4 pb-32">
      <div className="sticky top-0 z-10 bg-background flex items-center gap-2 py-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/performance')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Performance Metrics</h1>
      </div>
      <MetricCard 
        title={state.state.metric_type}
        description="Weekly Progress (Apr 14 - Apr 20, 2024)"
        data={state.state.metric_data}
        config={config}
        dataKey={dataKey}
        xAxisKey="date"
        trendingValue="8.2%"
        trendingDirection="up"
      />
    </div>
  );
};

export default MectricsGraphPage;
