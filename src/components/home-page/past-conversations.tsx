import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PastConversationItem {
  title?: string;
  time?: number;
  concepts?: number;
  lines?: number;
  date?: string;
}

interface PastConversationCardProps {
  title?: string;
  time?: number;
  concepts?: number;
  lines?: number;
  date?: string;
}

interface PastConversationProps {
  pastConversationItems?: PastConversationItem[];
}

const defaultPastConversationItems = [
    { title: 'Past Conversation 1', time: 10, concepts: 10, lines: 10, date: '2021-01-01' },
    { title: 'Past Conversation 2', time: 15, concepts: 15, lines: 15, date: '2021-01-02' },
    { title: 'Past Conversation 3', time: 20, concepts: 20, lines: 20, date: '2021-01-03' },
    { title: 'Past Conversation 4', time: 25, concepts: 25, lines: 25, date: '2021-01-04' },
    { title: 'Past Conversation 5', time: 30, concepts: 30, lines: 30, date: '2021-01-05' },
  ];

const PastConversationCard: React.FC<PastConversationCardProps> = ({ title="", time=0, concepts=0, lines=0, date="" }) => {
  return (
    <Card className="mb-4">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex flex-col">
          <CardTitle className="text-base">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">Time: {time} minutes</p>
            <p className="text-sm text-muted-foreground">Concepts: {concepts}</p>
            <p className="text-sm text-muted-foreground">Lines: {lines}</p>
            <p className="text-sm text-muted-foreground">Date: {date}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </Card>
  );
};

const PastConversation: React.FC<PastConversationProps> = ({ pastConversationItems = defaultPastConversationItems }) => {
  // Only show first two items
  const displayedItems = pastConversationItems.slice(0, 2);
  const hasMoreItems = pastConversationItems.length > 2;

  return (
    <div>
      {displayedItems.map((item, index) => (
        <PastConversationCard 
          key={index}
          title={item.title}
          time={item.time}
          concepts={item.concepts}
          lines={item.lines}
          date={item.date}
        />
      ))}
      {hasMoreItems && <Button variant="outline" className="w-full">View All</Button>}
    </div>
  );
};

export default PastConversation;
