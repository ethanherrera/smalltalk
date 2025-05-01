import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
interface DailyPracticeItem {
  title?: string;
  time?: number;
}

interface DailyPracticeCardProps {
  title?: string;
  time?: number;
}

interface DailyPracticeProps {
  dailyPracticeItems?: DailyPracticeItem[];
}

const defaultDailyPracticeItems = [
    { title: 'Daily Practice 1', time: 10 },
    { title: 'Daily Practice 2', time: 15 },
    { title: 'Daily Practice 3', time: 20 },
    { title: 'Daily Practice 4', time: 25 },
    { title: 'Daily Practice 5', time: 30 },
  ];

const DailyPracticeCard: React.FC<DailyPracticeCardProps> = ({ title="", time=0 }) => {
  return (
    <Card className="mb-4">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex flex-col items-start text-left">
          <CardTitle className="text-base mb-2">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">Time: {time} minutes</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </Card>
  );
};

const DailyPractice: React.FC<DailyPracticeProps> = ({ dailyPracticeItems = defaultDailyPracticeItems }) => {
  // Only show first two items
  const displayedItems = dailyPracticeItems.slice(0, 2);
  const hasMoreItems = dailyPracticeItems.length > 2;

  return (
    <div>
      {displayedItems.map((item, index) => (
        <DailyPracticeCard 
          key={index}
          title={item.title}
          time={item.time}
        />
      ))}
      {hasMoreItems && <Button variant="outline" className="w-full">View All</Button>}
    </div>
  );
};

export default DailyPractice;
