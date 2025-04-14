import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function ScoreScreen() {
  const { practiceScore } = useAppContext();
  const navigate = useNavigate();

  const handleFinish = () => {
    navigate('/');
  };

  const score = `${practiceScore?.correctAnswers || 8}/${practiceScore?.totalQuestions || 10}`;

  return (
    <div className="flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-md">
        {/* Score */}
        <h2 className="font-bold text-[#111111] mb-2">Your score</h2>
        <p className="text-black text-4xl font-bold mb-8">{score}</p>
        
        {/* Performance Summary */}
        <h2 className="font-bold text-[#111111] mb-4">Summary of performance</h2>
        <div className="border border-[#D9D9D9] rounded p-4 h-[405px] mb-8">
          <p className="italic text-gray-800">
            placeholder for graphs and word descriptions that summarize how users perormed in the Ai generated quiz
          </p>
        </div>
        
        {/* More practice */}
        <p className="font-bold underline text-[#111111] mb-8">More practice</p>
        
        {/* Finish button */}
        <button 
          onClick={handleFinish}
          className="w-full bg-[#D9D9D9] rounded-[20px] py-5 font-bold text-center"
        >
          Finish
        </button>
      </div>
    </div>
  );
}

export default ScoreScreen;