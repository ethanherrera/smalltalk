import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { MultipleChoiceQuestionData } from '@/types/practice';

interface MultipleChoiceQuestionProps {
  question: MultipleChoiceQuestionData;
  onAnswerSelected: (isCorrect: boolean, answer: string) => void;
  showAnswer: boolean;
  onNext: () => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  onAnswerSelected,
  showAnswer,
  onNext,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const handleOptionSelect = (optionId: string) => {
    if (showAnswer) return; // Prevent changing answer after submission
    
    setSelectedOption(optionId);
    const selectedOptionData = question.options.find(option => option.id === optionId);
    const isCorrect = !!selectedOptionData?.correct;
    
    onAnswerSelected(isCorrect, selectedOptionData?.text || '');
  };

  const getOptionClassName = (optionId: string, correct?: boolean) => {
    let baseClass = "p-4 border rounded-lg shadow-sm mb-3 transition-all duration-200 cursor-pointer";
    
    if (!showAnswer) {
      return `${baseClass} ${selectedOption === optionId ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50 hover:border-blue-500'}`;
    }
    
    if (correct) {
      return `${baseClass} bg-green-50 border-green-500`;
    }
    
    if (selectedOption === optionId && !correct) {
      return `${baseClass} bg-red-50 border-red-500`;
    }
    
    return `${baseClass} opacity-50`;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">{question.question}</h2>
        <p className="text-gray-500 text-sm">{question.prompt}</p>
      </div>

      <div className="space-y-2">
        {question.options.map((option) => (
          <div
            key={option.id}
            className={getOptionClassName(option.id, option.correct)}
            onClick={() => handleOptionSelect(option.id)}
          >
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center h-7 w-7 rounded-full border ${
                selectedOption === option.id ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300'
              }`}>
                {option.id}
              </div>
              <p className="text-base">{option.text}</p>
            </div>
          </div>
        ))}
      </div>

      {showAnswer && (
        <Card className="p-4 bg-blue-50">
          <p className="font-medium">Explanation</p>
          <p className="text-sm mt-1">{question.explanation}</p>
        </Card>
      )}
      
      <div className="flex justify-end mt-4">
        {showAnswer && (
          <Button
            onClick={onNext}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;