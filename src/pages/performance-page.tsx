import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart2, LineChart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PerformancePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 pb-32">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/home')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Performance Metrics</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-chart-1" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">Your weekly score is 69/100</p>
            <p className="text-sm text-muted-foreground">
              You've improved by 12% since last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-chart-2" />
              Streak Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">5 day streak</p>
            <p className="text-sm text-muted-foreground">
              Keep practicing daily to maintain your streak!
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-chart-3" />
              Concept Mastery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">27 concepts practiced</p>
            <ul className="list-disc pl-5 pt-2">
              <li className="text-sm">Greetings - Advanced</li>
              <li className="text-sm">Common Questions - Intermediate</li>
              <li className="text-sm">Daily Conversations - Beginner</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformancePage;
