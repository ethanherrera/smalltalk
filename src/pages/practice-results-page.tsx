// src/pages/practice-results-page.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const PracticeResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { score = 2, total = 3 } = location.state || {};
  const percentage = Math.round((score / total) * 100);
  const performance =
    percentage >= 80
      ? 'excellent'
      : percentage >= 60
      ? 'good'
      : 'needs practice';
  const feedbackText: Record<string, string> = {
    excellent:
      "Excellent work! Your understanding of Spanish grammar and vocabulary is impressive. You're making great progress.",
    good:
      "Good job! You've demonstrated solid understanding of key concepts. With continued practice, you'll improve even more.",
    'needs practice':
      "Keep practicing! You're on the right track, but more practice will help reinforce these concepts.",
  };

  return (
    <div className="flex flex-col min-h-screen px-4">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background flex items-center gap-2 py-2 px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/practice')}
          className="bg-black text-white hover:bg-gray-800 focus:outline-none"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Practice Results</h1>
      </div>

      {/* Completed progress bar */}
      <div className="h-1.5 w-full bg-black"></div>

      {/* Main content */}
      <div className="flex-1 py-8 flex flex-col gap-10 max-w-3xl mx-auto w-full">
        <div className="flex flex-col items-center bg-black p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-white">Your Score</h2>
          <div className="text-8xl font-bold text-white">{score}/{total}</div>
          <div className="mt-2 text-xl font-semibold text-white">
            {percentage}% correct
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3 text-white">Feedback</h2>
          <div className="border border-gray-700 rounded-xl p-6 shadow-sm bg-black">
            <p className="text-base italic text-white font-medium text-left">
              {feedbackText[performance]}
            </p>

            <h3 className="mt-8 mb-4 font-semibold text-lg text-white">
              Performance Metrics
            </h3>
            <div className="flex gap-6">
              <div className="flex flex-col items-center w-1/3 min-w-0 bg-black p-3 rounded-lg shadow-sm border border-gray-700">
                <div className="h-32 w-full bg-gray-800 rounded-md flex items-end">
                  <div
                    className="w-full bg-primary rounded-b-md transition-all duration-500"
                    style={{ height: `${Math.min(90, percentage)}%` }}
                  />
                </div>
                <span className="mt-3 text-sm font-medium text-white">Accuracy</span>
              </div>
              <div className="flex flex-col items-center w-1/3 min-w-0 bg-black p-3 rounded-lg shadow-sm border border-gray-700">
                <div className="h-32 w-full bg-gray-800 rounded-md flex items-end">
                  <div
                    className="w-full bg-primary/60 rounded-b-md transition-all duration-500"
                    style={{ height: `${Math.min(60, percentage)}%` }}
                  />
                </div>
                <span className="mt-3 text-sm font-medium text-white">Speed</span>
              </div>
              <div className="flex flex-col items-center w-1/3 min-w-0 bg-black p-3 rounded-lg shadow-sm border border-gray-700">
                <div className="h-32 w-full bg-gray-800 rounded-md flex items-end">
                  <div
                    className="w-full bg-primary/80 rounded-b-md transition-all duration-500"
                    style={{ height: `${Math.min(80, percentage + 10)}%` }}
                  />
                </div>
                <span className="mt-3 text-sm font-medium text-white whitespace-normal text-center">
                  Comprehen<br/>sion
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-6">
          <Button
            className="py-6 text-lg font-bold rounded-full bg-black border border-gray-700 hover:bg-gray-900 text-white flex items-center justify-center gap-3 shadow-sm"
            onClick={() => navigate('/practice')}
          >
            <RotateCcw className="h-5 w-5" /> Try Again
          </Button>

          <Button
            className="py-6 text-lg font-bold rounded-full bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-center gap-3 shadow-md"
            onClick={() => navigate('/home')}
          >
            <Home className="h-5 w-5" /> Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PracticeResultsPage;