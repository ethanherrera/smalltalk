import React from 'react';
import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/performance-page/metric-card';
import { MetricCardCondensed } from '@/components/performance-page/metric-card-condensed'
import { ChartConfig } from '@/components/ui/chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const weeklyProgressData = [
  { date: "Monday, Apr 14", score: 20, vocabulary: 40, pronunciation: 60, fluency: 30 },
  { date: "Tuesday, Apr 15", score: 82, vocabulary: 75, pronunciation: 78, fluency: 80 },
  { date: "Wednesday, Apr 16", score: 79, vocabulary: 81, pronunciation: 84, fluency: 77 },
  { date: "Thursday, Apr 17", score: 87, vocabulary: 86, pronunciation: 89, fluency: 83 },
  { date: "Friday, Apr 18", score: 91, vocabulary: 89, pronunciation: 87, fluency: 88 },
  { date: "Saturday, Apr 19", score: 92, vocabulary: 92, pronunciation: 81, fluency: 86 },
  { date: "Sunday, Apr 20", score: 93, vocabulary: 95, pronunciation: 90, fluency: 91 },
];

var data = [];


// create fake data
var data: Array<Record<string, any>> = [];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
var days = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"]
var month_index = 1;
for (var i = 0; i < 30; i++) {

  if (i%30 == 0) {
    month_index++;
  }

  var date = new Date(2025, 0);
  date = new Date(date.setDate(i));
    data.push({ date: i,
      month: months[month_index],
      day: days[i%7], 
      date2: date,
      score: (5*Math.sqrt(i) - getRandomInt(0,10))/10, 
      vocabulary: (5*Math.sqrt(i) - getRandomInt(0,10))/10, 
      pronunciation: (5*Math.sqrt(i) - getRandomInt(0,10))/10,  
      fluency: (5*Math.sqrt(i) - getRandomInt(0,10))/10});
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

const PerformancePage: React.FC = () => {
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);

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
      <div className="flex justify-between"> 
        <div> Metric </div>
        <div> Today's Score </div>
      </div>
      <MetricCardCondensed 
        title="Grammar"
        description="Weekly Progress (Apr 14 - Apr 20, 2024)"
        data={data}
        config={chartConfigs.grammar}
        dataKey="score"
        xAxisKey="date"
        trendingValue="8.2%"
        trendingDirection="up"
        onClick={() => navigate('/metrics-graph', { state: {metric_type: "Grammar"} })}
      />
      <MetricCardCondensed 
        title="Vocabulary"
        description="Weekly Progress (Apr 14 - Apr 20, 2024)"
        data={data}
        config={chartConfigs.vocabulary}
        dataKey="vocabulary"
        xAxisKey="date"
        trendingValue="11.4%"
        trendingDirection="up"
        onClick={() => navigate('/metrics-graph', { state: {metric_type: "Vocabulary"} })}
      />
      <MetricCardCondensed 
        title="Pronunciation"
        description="Weekly Progress (Apr 14 - Apr 20, 2024)"
        data={data}
        config={chartConfigs.pronunciation}
        dataKey="pronunciation"
        xAxisKey="date"
        trendingValue="11.4%"
        trendingDirection="up"
        onClick={() => navigate('/metrics-graph', { state: {metric_type: "Pronunciation"} })}
      />
      <MetricCardCondensed 
        title="Fluency"
        description="Weekly Progress (Apr 14 - Apr 20, 2024)"
        data={data}
        config={chartConfigs.fluency}
        dataKey="fluency"
        xAxisKey="date"
        trendingValue="11.4%"
        trendingDirection="up"
        onClick={() => navigate('/metrics-graph', { state: {metric_type: "Fluency"} })}
      />
    </div>
  );
};

export default PerformancePage;
