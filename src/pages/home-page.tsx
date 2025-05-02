import React from 'react';
import logo from '@/assets/SmallTalk.png';
import { Metrics } from '@/components/home-page/metrics';
import DailyPractice from '@/components/home-page/daily-practice';
import PastConversation from '@/components/home-page/past-conversations';
import RecordConversation from '@/components/home-page/record-conversation';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 pb-32">
      <img
        src={logo}
        alt="SmallTalk Logo"
        className="w-30 h-auto block mx-auto"
      />

      <h1 className="text-[1.375rem] mt-5 font-bold text-start">
        Welcome back, Oski!
      </h1>

      <Metrics />

      <h1 className="mt-5 text-2xl font-bold text-start">
        Daily Practice
      </h1>
      <DailyPractice />

      <h1 className="mt-5 text-2xl font-bold text-start">
        Past Conversations
      </h1>
      <PastConversation />

      <RecordConversation />
    </div>
  );
};

export default HomePage;
