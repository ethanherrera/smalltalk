import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AudioRecorder from './AudioRecorder';
import { useAppContext } from '../context/AppContext';

function RecordScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState(
    "Script of the conversation can be here\nYou: xxxxxxx\nOther: xxxxxxxxx"
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const { setRecordingData } = useAppContext();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = (audioBlob) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
    
    // In a real app, we would send this to the server for processing
    // For now, we'll store the blob directly in the context
    if (audioBlob) {
      setRecordingData({
        audio: audioBlob, // Store the blob directly instead of creating a URL
        duration: recordingTime,
        transcript: transcript
      });
    }
    
    setIsSubmitted(true);
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
    setRecordingTime(0);
  };

  const handleSubmit = () => {
    navigate('/feedback');
  };

  const formatTime = (seconds) => {
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center px-4 pt-6">
      <div className="w-full max-w-md h-[673px] border border-[#D9D9D9] rounded p-4 overflow-y-auto">
        <p className="italic text-[#111111] whitespace-pre-line">
          {transcript}
        </p>
      </div>

      {!isSubmitted ? (
        <div className="w-full max-w-md h-[77px] mt-7 border-2 border-[#D9D9D9] rounded-[20px] flex items-center justify-between px-4">
          <AudioRecorder 
            onStart={startRecording}
            onStop={stopRecording}
            isRecording={isRecording}
          />
          <span className="font-semibold text-lg text-[#111111]">
            {formatTime(recordingTime)}
          </span>
        </div>
      ) : (
        <div className="w-full max-w-md flex justify-between gap-6 mt-7">
          <button 
            onClick={handleTryAgain}
            className="w-1/2 h-[77px] bg-[#D9D9D9] rounded-[20px] font-bold"
          >
            Try Again
          </button>
          <button 
            onClick={handleSubmit}
            className="w-1/2 h-[77px] bg-[#D9D9D9] rounded-[20px] font-bold"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

export default RecordScreen;