// src/pages/home-page.tsx
import React from "react";
import logo from "@/assets/SmallTalk.png";
import ThemeToggleButton from "@/components/ui/ThemeToggleButton";
import { Metrics } from "@/components/home-page/metrics";
import DailyPractice from "@/components/home-page/daily-practice";
import PastConversation from "@/components/home-page/past-conversations";
import RecordConversation from "@/components/home-page/record-conversation";

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 pb-32">
      <header className="relative py-4">
        <img
          src={logo}
          alt="SmallTalk Logo"
          className="h-10 mx-auto block"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <ThemeToggleButton />
        </div>
      </header>

      <h1 className="text-2xl mt-5 font-bold text-start">
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
