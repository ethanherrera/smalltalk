import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DailyPracticeItem {
  title?: string;
  time?: number;
  id?: number;
}

interface DailyPracticeCardProps {
  title?: string;
  time?: number;
  id?: number;
}

interface DailyPracticeProps {
  dailyPracticeItems?: DailyPracticeItem[];
}

const defaultDailyPracticeItems = [
    { title: 'Daily Practice 1', time: 10, id: 1 },
    { title: 'Daily Practice 2', time: 15, id: 2 },
    { title: 'Daily Practice 3', time: 20, id: 3 },
    { title: 'Daily Practice 4', time: 25, id: 4 },
    { title: 'Daily Practice 5', time: 30, id: 5 },
  ];

const DailyPracticeCard: React.FC<DailyPracticeCardProps> = ({ title="", time=0, id=1 }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/practice/${id}`);
  };

  return (
    <Card className="mb-4 cursor-pointer" onClick={handleClick}>
      <div className="flex items-center justify-between px-6 py-3">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">Time: {time} minutes</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </Card>
  );
};

const DailyPractice: React.FC<DailyPracticeProps> = ({ dailyPracticeItems = defaultDailyPracticeItems }) => {
  const navigate = useNavigate();
  const displayedItems = dailyPracticeItems.slice(0, 2);
  const hasMoreItems = dailyPracticeItems.length > 2;

  return (
    <div>
      {displayedItems.map((item, index) => (
        <DailyPracticeCard 
          key={index}
          title={item.title}
          time={item.time}
          id={item.id}
        />
      ))}
      {hasMoreItems && (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate('/practice')}
        >
          View All
        </Button>
      )}
    </div>
  );
};

export default DailyPractice;
