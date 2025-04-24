// React is imported for JSX
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

interface Conversation {
  title: string;
  date: string;
  score: number;
  badge: string;
}

export function PastConversations() {
  const conversations: Conversation[] = [
    {
      title: 'Meeting with Client',
      date: 'Apr 22, 2024',
      score: 87,
      badge: 'Professional',
    },
    {
      title: 'Coffee Shop Conversation',
      date: 'Apr 21, 2024',
      score: 92,
      badge: 'Casual',
    },
    {
      title: 'Phone Call with Vendor',
      date: 'Apr 20, 2024',
      score: 78,
      badge: 'Business',
    },
    {
      title: 'Travel Booking',
      date: 'Apr 19, 2024',
      score: 85,
      badge: 'Travel',
    },
    {
      title: 'Restaurant Order',
      date: 'Apr 18, 2024',
      score: 90,
      badge: 'Food',
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Past Conversations</h2>
      <div className="flex flex-col space-y-3">
        {conversations.map((conversation, index) => (
          <Card key={index} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-base">{conversation.title}</CardTitle>
                <CardDescription>{conversation.date}</CardDescription>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xl font-bold text-white">{conversation.score}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {conversation.badge}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default PastConversations;