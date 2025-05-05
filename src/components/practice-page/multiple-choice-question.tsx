import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { MultipleChoiceQuestionData } from '@/types/practice';

interface MultipleChoiceQuestionProps {
  question: MultipleChoiceQuestionData;
  onAnswerSelected: (isCorrect: boolean, answer: string) => void;
  showAnswer: boolean;
  onNext: () => void;
  onPrev: () => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  onAnswerSelected,
  showAnswer,
  onNext,
  onPrev,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const base =
    "p-4 border rounded-lg shadow-sm mb-3 transition-all duration-200 cursor-pointer bg-card text-card-foreground border-border";

  const handleOptionSelect = (optionId: string) => {
    if (showAnswer) return;
    setSelectedOption(optionId);
    const sel = question.options.find(o => o.id === optionId)!;
    onAnswerSelected(!!sel.correct, sel.text);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">{question.question}</h2>
        <p className="text-sm text-muted-foreground">{question.prompt}</p>
      </div>

      <div className="space-y-2">
        {question.options.map(opt => {
          const isSel = selectedOption === opt.id;
          let cls = base;
          if (!showAnswer) {
            cls += isSel
              ? " ring-2 ring-primary"
              : " hover:ring-2 hover:ring-primary/50";
          } else if (opt.correct) {
            cls += " border-green-700";
          } else if (isSel) {
            cls += " border-destructive";
          } else {
            cls += " opacity-50";
          }

          return (
            <div
              key={opt.id}
              className={cls}
              onClick={() => handleOptionSelect(opt.id)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center h-7 w-7 rounded-full border border-border bg-transparent text-foreground"
                >
                  {opt.id}
                </div>
                <p className="text-base">{opt.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {showAnswer && (
        <div className="fixed bottom-6 inset-x-0 px-4 z-10">
          <Card className="w-full max-w-2xl mx-auto p-6 rounded-lg bg-card text-card-foreground border-border shadow-lg">
            <p className="font-medium text-lg">Explanation</p>
            <p className="mt-2 text-sm">{question.explanation}</p>
            <div className="mt-6 flex items-center justify-between">
              <Button
                onClick={onPrev}
                className="py-8 px-12 text-base rounded-full bg-secondary text-secondary-foreground"
              >
                Back
              </Button>
              <Button
                onClick={onNext}
                className="py-8 px-14 text-base rounded-full bg-primary text-white"
              >
                Continue
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceQuestion;