import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import RecordScreen from './components/RecordScreen';
import FeedbackScreen from './components/FeedbackScreen';
import GrammarFeedback from './components/GrammarFeedback';
import PracticeScreen from './components/PracticeScreen';
import ScoreScreen from './components/ScoreScreen';
import { AppProvider } from './context/AppContext';
import './styles/customStyles.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-white">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Navigate replace to="/record" />} />
              <Route path="/record" element={<RecordScreen />} />
              <Route path="/feedback" element={<FeedbackScreen />} />
              <Route path="/grammar-feedback" element={<GrammarFeedback />} />
              <Route path="/practice" element={<PracticeScreen />} />
              <Route path="/score" element={<ScoreScreen />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;