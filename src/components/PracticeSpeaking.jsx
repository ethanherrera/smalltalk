import React, { useState } from 'react';
import AudioRecorder from './AudioRecorder';

function PracticeSpeaking({ question, showResult, onAnswer, onNext, isLastQuestion }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [userResponse, setUserResponse] = useState("");

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = (audioBlob) => {
    setIsRecording(false);
    
    // In a real app, this would send the audio to the server for analysis
    // For now, simulate a correct answer after recording
    setTimeout(() => {
      setUserResponse("Podemos coordinar la reunión para el viernes a las 3 PM.");
      onAnswer(true);
    }, 1000);
  };

  return (
    <div>
      <h2 className="font-semibold mb-6">Speak and improve</h2>
      
      <div className="mb-10">
        <p>
          <span className="font-semibold">{question.prompt.role}: </span>
          <span>{question.prompt.text}</span>
        </p>
        
        <p className="font-semibold mt-4">Record your response below:</p>
        <p>{question.instructions}</p>
      </div>
      
      {!showResult && (
        <div className="w-full h-[77px] mt-7 border-2 border-[#D9D9D9] rounded-[20px] flex items-center justify-between px-4">
          <AudioRecorder 
            onStart={handleStartRecording}
            onStop={handleStopRecording}
            isRecording={isRecording}
          />
          <span className="font-semibold text-lg text-[#111111]">
            {recordingTime ? `${Math.floor(recordingTime / 60)}:${String(recordingTime % 60).padStart(2, '0')}` : '0:12'}
          </span>
        </div>
      )}
      
      {/* Result feedback */}
      {showResult && (
        <div className="w-full bg-[#F1F1F1] rounded-t-[20px] fixed bottom-0 left-0 p-4 min-h-[306px]">
          <h2 className="font-bold text-lg mb-4">Correct!</h2>
          
          <div>
            <p className="font-semibold">Your response:</p>
            <p>{userResponse}</p>
            <p className="font-semibold mt-2">
              ✔️ Word Order    ✔️ Grammar Accuracy    ✔️ Pronunciation
            </p>
          </div>
          
          <button
            onClick={onNext}
            className="w-full bg-[#D9D9D9] rounded-[20px] py-3 font-bold text-center mt-6"
          >
            {isLastQuestion ? "Finish" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
}

export default PracticeSpeaking;