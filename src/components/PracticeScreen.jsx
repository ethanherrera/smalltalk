import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PracticeQuestion from './PracticeQuestion';
import PracticeSpeaking from './PracticeSpeaking';
import { practiceData } from '../data/practiceData';
import { useAppContext } from '../context/AppContext';

function PracticeScreen() {
  const navigate = useNavigate();
  const { setPracticeScore } = useAppContext();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [progressPercent, setProgressPercent] = useState(70);

  const currentQuestion = practiceData[currentQuestionIndex];

  useEffect(() => {
    // Update progress bar based on current index
    setProgressPercent((currentQuestionIndex + 1) / practiceData.length * 100);
    
    // If we've gone through all questions, go to score screen
    if (currentQuestionIndex >= practiceData.length) {
      setPracticeScore({
        correctAnswers: correctAnswers,
        totalQuestions: practiceData.length
      });
      navigate('/score');
    }
  }, [currentQuestionIndex, correctAnswers, navigate, setPracticeScore]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
      setShowResult(true);
    } else {
      setShowResult(true);
    }
  };

  const handleNext = () => {
    setShowResult(false);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const isLastQuestion = currentQuestionIndex === practiceData.length - 1;

  // If all questions are completed, show score
  if (currentQuestionIndex >= practiceData.length) {
    return null; // This will trigger the useEffect and navigate to score
  }

  return (
    <div className="flex flex-col items-center">
      {/* Progress bar */}
      <div className="w-full h-[6px] bg-[#D9D9D9]">
        <div 
          className="h-full bg-[#111111] rounded-r-[5px]"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <div className="w-full max-w-md px-4 py-6">
        {currentQuestion.type === 'multiple-choice' ? (
          <PracticeQuestion 
            question={currentQuestion}
            showResult={showResult}
            onAnswer={handleAnswer}
            onNext={handleNext}
            isLastQuestion={isLastQuestion}
          />
        ) : (
          <PracticeSpeaking 
            question={currentQuestion}
            showResult={showResult}
            onAnswer={handleAnswer}
            onNext={handleNext}
            isLastQuestion={isLastQuestion}
          />
        )}
      </div>
    </div>
  );
}

export default PracticeScreen;