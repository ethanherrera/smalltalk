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

const weeklyProgressData = [
  { date: "Monday, Apr 14", score: 20, vocabulary: 40, pronunciation: 60, fluency: 30 },
  { date: "Tuesday, Apr 15", score: 82, vocabulary: 75, pronunciation: 78, fluency: 80 },
  { date: "Wednesday, Apr 16", score: 79, vocabulary: 81, pronunciation: 84, fluency: 77 },
  { date: "Thursday, Apr 17", score: 87, vocabulary: 86, pronunciation: 89, fluency: 83 },
  { date: "Friday, Apr 18", score: 91, vocabulary: 89, pronunciation: 87, fluency: 88 },
  { date: "Saturday, Apr 19", score: 92, vocabulary: 92, pronunciation: 81, fluency: 86 },
  { date: "Sunday, Apr 20", score: 93, vocabulary: 95, pronunciation: 90, fluency: 91 },
];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

// create fake data
var data: Array<Record<string, any>> = [];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
var month_index = 1;
for (var i = 0; i < 365*3; i++) {

  if (i%30 == 0) {
    month_index++;
  }

  var date = new Date(2023, 0);
  date = new Date(date.setDate(i));

  if (i > 365*3-30) {
    data.push({ date: i,
                month: date.getMonth(),
                day: date.getDate(),
                year: date.getFullYear(),
                datetime: date,
                score: getRandomInt(90,100), 
                vocabulary: getRandomInt(90,100), 
                pronunciation: getRandomInt(90,100), 
                fluency: getRandomInt(90,100)})
  }
  else {
    data.push({ date: i,
      month: date.getMonth(),
      day: days[i%7], 
      year: date.getFullYear(),
      datetime: date,
      score: Math.sqrt(i) + getRandomInt(0,10), 
      vocabulary: Math.sqrt(i) + getRandomInt(0,10), 
      pronunciation: Math.sqrt(i) + getRandomInt(0,10),  
      fluency: Math.sqrt(i) + getRandomInt(0,10) });
  }
}


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

const MectricsGraphPage: React.FC = (metric_type) => {
  const navigate = useNavigate();

  var config;
  var dataKey;
  var type = metric_type.metric_type;

  if (type == "Grammer") {
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
        title={metric_type.metric_type}
        description="Weekly Progress (Apr 14 - Apr 20, 2024)"
        data={data}
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
