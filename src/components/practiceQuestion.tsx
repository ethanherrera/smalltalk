import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Send, RotateCcw } from 'lucide-react';

interface Answer {
  text: string;
  isCorrect: boolean;
  translation?: string;
}

interface PracticeQuestionProps {
  colleague: string;
  question: string;
  answers: Answer[];
  onAnswerSelected?: (isCorrect: boolean) => void;
  onNext?: () => void;
}

export function PracticeQuestion({ 
  colleague, 
  question, 
  answers, 
  onAnswerSelected,
  onNext 
}: PracticeQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerClick = (index: number) => {
    if (!isSubmitted) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setIsSubmitted(true);
      onAnswerSelected?.(answers[selectedAnswer].isCorrect);
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Find the correct answer</h2>
        <div className="flex items-start gap-2">
          <span className="text-xl">👥</span>
          <p className="font-medium">
            Your Colleague: {question}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {answers.map((answer, index) => (
          <Card
            key={index}
            className={`p-4 cursor-pointer transition-colors ${
              selectedAnswer === index 
                ? 'bg-[#2D2D2D] border-2 border-blue-500 text-white' 
                : 'bg-[#1A1A1A] hover:bg-[#2D2D2D] text-white'
            } ${
              isSubmitted ? 'cursor-not-allowed' : ''
            } ${
              isSubmitted && selectedAnswer === index && answer.isCorrect 
                ? 'bg-[#2D2D2D] border-2 border-green-500 text-white'
                : isSubmitted && selectedAnswer === index && !answer.isCorrect
                ? 'bg-[#2D2D2D] border-2 border-red-500 text-white'
                : ''
            }`}
            onClick={() => handleAnswerClick(index)}
          >
            <div className="flex items-center justify-between">
              <span className="text-white">{answer.text}</span>
              <span className="text-xl">🔊</span>
            </div>
          </Card>
        ))}
      </div>

      {selectedAnswer !== null && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
          {isSubmitted && (
            <div className="container mx-auto max-w-3xl p-4 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">
                  {answers[selectedAnswer].isCorrect ? 'Correct!' : 'Incorrect'}
                </h3>
                <div className="text-left">
                  <p className="text-white font-medium">Translation:</p>
                  <p className="text-white">{answers[selectedAnswer].translation}</p>
                </div>
              </div>
              <Button 
                className={`w-full ${
                  answers[selectedAnswer].isCorrect 
                    ? 'bg-gray-200 hover:bg-gray-300 text-black'
                    : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white'
                }`}
                onClick={answers[selectedAnswer].isCorrect ? onNext : handleTryAgain}
              >
                {answers[selectedAnswer].isCorrect ? (
                  'Done'
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </>
                )}
              </Button>
            </div>
          )}
          {!isSubmitted && (
            <div className="container mx-auto max-w-3xl p-4">
              <Button 
                className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                onClick={handleSubmit}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 