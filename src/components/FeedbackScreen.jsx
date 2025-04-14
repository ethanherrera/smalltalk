import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AudioPlayer from './AudioPlayer';
import { useAppContext } from '../context/AppContext';

function FeedbackScreen() {
  const { recordingData } = useAppContext();
  const navigate = useNavigate();
  
  // Mock data for feedback
  const [feedback, setFeedback] = useState({
    summary: "Your conversation demonstrated strong fluency, with accurate use of common medical phrases; however, minor grammar errors were detected in verb conjugation and article usage.",
    scores: {
      pronunciation: 2,
      grammar: 3,
      terminology: 3,
      fluency: 4
    }
  });

  const handleViewAnnotatedScript = () => {
    navigate('/grammar-feedback');
  };

  const handlePracticeClick = () => {
    navigate('/practice');
  };

  return (
    <div className="flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-md">
        {/* Summary Section */}
        <h2 className="font-bold text-[#111111] mb-2">Summary</h2>
        <p className="mb-8 text-[#111111]">{feedback.summary}</p>

        {/* Mistakes Section */}
        <h2 className="font-bold text-[#111111] mb-2">Mistakes</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Pronunciation */}
          <div className="border-2 border-[#D9D9D9] rounded-[20px] h-40 flex flex-col items-center justify-center">
            <span className="text-3xl text-[rgba(0,0,0,0.60)] font-semibold">
              {feedback.scores.pronunciation}
            </span>
            <span className="text-[rgba(0,0,0,0.60)] font-semibold mt-4">
              Pronunciation
            </span>
          </div>
          
          {/* Grammar */}
          <div className="border-2 border-[#D9D9D9] rounded-[20px] h-40 flex flex-col items-center justify-center">
            <span className="text-3xl text-[rgba(0,0,0,0.60)] font-semibold">
              {feedback.scores.grammar}
            </span>
            <span className="text-[rgba(0,0,0,0.60)] font-semibold mt-4">
              Grammar
            </span>
          </div>
          
          {/* Terminology */}
          <div className="border-2 border-[#D9D9D9] rounded-[20px] h-40 flex flex-col items-center justify-center">
            <span className="text-3xl text-[rgba(0,0,0,0.60)] font-semibold">
              {feedback.scores.terminology}
            </span>
            <span className="text-[rgba(0,0,0,0.60)] font-semibold mt-4">
              Terminology
            </span>
          </div>
          
          {/* Fluency */}
          <div className="border-2 border-[#D9D9D9] rounded-[20px] h-40 flex flex-col items-center justify-center">
            <span className="text-3xl text-[rgba(0,0,0,0.60)] font-semibold">
              {feedback.scores.fluency}
            </span>
            <span className="text-[rgba(0,0,0,0.60)] font-semibold mt-4">
              Fluency
            </span>
          </div>
        </div>

        {/* View annotated script */}
        <div onClick={handleViewAnnotatedScript} className="cursor-pointer mb-4">
          <h2 className="font-bold text-[#111111]">View annotated script</h2>
          <hr className="border-t border-black w-44 mt-1" />
        </div>

        {/* Practice button */}
        <button 
          onClick={handlePracticeClick}
          className="w-full bg-[#D9D9D9] rounded-[20px] py-5 font-bold text-center"
        >
          Practice
        </button>

        {/* Audio player */}
        <div className="w-full h-[77px] mt-6 border-2 border-[#D9D9D9] rounded-[20px] flex items-center justify-between px-4">
          <AudioPlayer 
            audioUrl={recordingData?.audio} 
            duration={recordingData?.duration || 34} 
          />
        </div>
      </div>
    </div>
  );
}

export default FeedbackScreen;