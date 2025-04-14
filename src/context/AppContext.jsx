import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [recordingData, setRecordingData] = useState({
    audio: null,
    duration: 0,
    transcript: ""
  });
  
  const [practiceScore, setPracticeScore] = useState({
    correctAnswers: 0,
    totalQuestions: 0
  });

  return (
    <AppContext.Provider value={{
        recordingData,
        setRecordingData,
        practiceScore,
        setPracticeScore
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;