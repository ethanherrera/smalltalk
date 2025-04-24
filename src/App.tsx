import './App.css'
import HomePage from './pages/home-page'
import PerformancePage from './pages/performance-page'
import RecordPage from './pages/record-page'
import FeedbackPage from './pages/feedback-page'
import SpecificFeedbackPage from './pages/specific-feedback-page'
import PracticePage from './pages/practice-page'
import GrammarFeedbackPage from './pages/grammar-feedback-page'
import PracticeResultsPage from './pages/practice-results-page'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/record" element={<RecordPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/specific-feedback/:feedback" element={<SpecificFeedbackPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/grammar-feedback" element={<GrammarFeedbackPage />} />
        <Route path="/practice-results" element={<PracticeResultsPage />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
