import React, { useState } from 'react';

function PracticeQuestion({ question, showResult, onAnswer, onNext, isLastQuestion }) {
  const [selectedOption, setSelectedOption] = useState(null);
  
  const handleOptionSelect = (optionIndex) => {
    if (showResult) return;
    setSelectedOption(optionIndex);
    onAnswer(optionIndex === question.correctAnswer);
  };
  
  const getOptionClassName = (index) => {
    const baseClass = "w-full h-auto min-h-[88px] border border-[#D9D9D9] rounded-[20px] p-4 mb-4";
    
    if (!showResult || selectedOption !== index) {
      return baseClass;
    }
    
    if (index === question.correctAnswer) {
      return `${baseClass} bg-[#D9D9D9] border-[rgba(0,0,0,0.60)]`;
    }
    
    return baseClass;
  };
  
  const getTextClassName = (index) => {
    if (showResult && index === question.correctAnswer) {
      return "font-semibold";
    }
    return "font-normal";
  };
  
  return (
    <div>
      <h2 className="font-semibold mb-6">Find the correct answer</h2>
      
      <div className="mb-10">
        <p>
          <span className="font-semibold">{question.prompt.role}: </span>
          <span>{question.prompt.text}</span>
        </p>
        
        <p className="font-semibold mt-4">Which response is correct?</p>
      </div>
      
      {/* Options */}
      <div>
        {question.options.map((option, index) => (
          <div 
            key={index}
            className={getOptionClassName(index)}
            onClick={() => handleOptionSelect(index)}
          >
            <p className={getTextClassName(index)}>
              {String.fromCharCode(65 + index)}) {option}
            </p>
            
            {showResult && index === selectedOption && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-6 border-2 border-black rounded-sm">
                  {index === question.correctAnswer && (
                    <div className="w-4 h-4 bg-black m-[2px]"></div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Result feedback */}
      {showResult && (
        <div className="w-full bg-[#F1F1F1] rounded-t-[20px] fixed bottom-0 left-0 p-4 min-h-[228px]">
          <h2 className="font-bold text-lg mb-4">
            {selectedOption === question.correctAnswer ? "Correct!" : "Incorrect!"}
          </h2>
          
          <div>
            <p className="font-semibold">Translation:</p>
            <p>{question.translation}</p>
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

export default PracticeQuestion;