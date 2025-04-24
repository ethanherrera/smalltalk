import { Metrics } from '@/components/home-page/metrics';
import DailyPractice from '@/components/home-page/daily-practice';
import PastConversation from '@/components/home-page/past-conversations';
import RecordConversation from '@/components/home-page/record-conversation';
import PracticeNavigation from '@/components/home-page/practice-navigation';
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 pb-32">
      <h1 className="text-2xl font-bold text-start" >SmallTalk</h1>
      <h1 className="text-2l font-bold text-start" >Welcome back, Oski!</h1>
      <Metrics />
      <h1 className="text-2l font-bold text-start" >Daily Practice</h1>
      <DailyPractice />
      <h1 className="text-2l font-bold text-start" >Past Conversations</h1>
      <PastConversation />
      <RecordConversation />
      <PracticeNavigation />
    </div>
  );
};

export default HomePage;    
