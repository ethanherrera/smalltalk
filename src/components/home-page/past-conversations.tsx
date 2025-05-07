import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePastConversations } from '@/contexts/PastConversationsContext';
import { useNavigate } from 'react-router-dom';

interface PastConversationCardProps {
  title?: string;
  time?: number;
  concepts?: number;
  lines?: number;
  date?: string;
  transcript?: string;
  index: number;
}

const PastConversationCard: React.FC<PastConversationCardProps> = ({
  title = "",
  time = 0,
  concepts = 0,
  lines = 0,
  date = "",
  transcript = "",
  index
}) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="mb-4 cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => navigate(`/past-conversation/${index}`)}
    >
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex flex-col items-start text-left">
          <CardTitle className="text-base mb-2">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">Time: {time} minutes</p>
          <p className="text-sm text-muted-foreground">Concepts: {concepts}</p>
          <p className="text-sm text-muted-foreground">Lines: {lines}</p>
          <p className="text-sm text-muted-foreground">Date: {date}</p>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{transcript}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </Card>
  );
};

const PastConversation: React.FC = () => {
  const { pastConversations } = usePastConversations();
  const navigate = useNavigate();
  const displayedItems = pastConversations.slice(0, 2);
  const hasMoreItems = pastConversations.length > 2;

  return (
    <div>
      {pastConversations.length === 0 ? (
        <Card className="mb-4">
          <div className="px-6 py-8 text-center">
            <p className="text-muted-foreground">No conversations yet. Start a new conversation to see it here!</p>
          </div>
        </Card>
      ) : (
        <>
          {displayedItems.map((item, index) => (
            <PastConversationCard
              key={index}
              title={item.title}
              time={item.time}
              concepts={item.concepts}
              lines={item.lines}
              date={item.date}
              transcript={item.transcript}
              index={index}
            />
          ))}
          {hasMoreItems && (
            <Button variant="outline" className="w-full">
              View All
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default PastConversation;
