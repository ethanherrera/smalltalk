import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export interface Option {
  id: string;
  text: string;
  correct?: boolean;
}

interface MultipleChoiceQuestionProps {
  question: {
    question: string;
    prompt: string;
    options: Option[];
    explanation: string;
  };
  onAnswerSelected: (isCorrect: boolean, answer?: string) => void;
  showAnswer: boolean;
  onNext: () => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  onAnswerSelected,
  showAnswer,
  onNext
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const handleOptionSelect = (optionId: string) => {
    if (!showAnswer) {
      setSelectedOption(optionId);
      const isCorrect = question.options.find(opt => opt.id === optionId)?.correct || false;
      onAnswerSelected(isCorrect, question.options.find(opt => opt.id === optionId)?.text);
    }
  };
  
  const correctOption = question.options.find(opt => opt.correct)?.id || '';
  const isCorrect = selectedOption === correctOption;
  
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-semibold">Find the correct answer</h2>
      
      <div className="mt-2">
        <p className="whitespace-pre-wrap">{question.question}</p>
        <p className="font-semibold mt-4">{question.prompt}</p>
      </div>
      
      <div className="mt-4 space-y-4">
        {question.options.map((option) => (
          <div 
            key={option.id}
            className={`flex items-center justify-between p-4 rounded-xl border ${
              selectedOption === option.id ? 'border-gray-800' : 'border-gray-300'
            } ${showAnswer && option.correct ? 'bg-gray-100 border-gray-800' : ''}
            ${showAnswer && selectedOption === option.id && !option.correct ? 'border-red-300' : ''}
            cursor-pointer transition-all duration-200 hover:border-gray-500`}
            onClick={() => handleOptionSelect(option.id)}
          >
            <p className={`${(showAnswer && option.correct) ? 'font-semibold' : ''}`}>{option.text}</p>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              selectedOption === option.id 
                ? showAnswer 
                  ? option.correct 
                    ? 'bg-blue-600' 
                    : 'bg-red-500' 
                  : 'bg-blue-600'
                : 'border-2 border-gray-300'
            }`}>
              {selectedOption === option.id && (
                <Check className="h-4 w-4 text-white" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      {showAnswer && (
        <div className="mt-8 pt-6 pb-4 fixed bottom-0 left-0 right-0 bg-gray-100 rounded-t-2xl shadow-lg">
          <div className="px-10">
            <h3 className="text-lg font-bold text-black">
              {isCorrect ? 'Correct!' : 'Incorrect!'}
            </h3>
            <div className="mt-2">
              <p className="font-semibold text-gray-800">Translation:</p>
              <p className="text-gray-700">{question.explanation}</p>
            </div>
            
            <Button
              className="w-full py-5 mt-6 text-base font-bold rounded-full bg-gray-200 hover:bg-gray-300 text-black"
              onClick={onNext}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceQuestion;