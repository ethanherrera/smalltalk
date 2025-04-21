import './App.css'
import HomePage from './pages/home-page'
import PerformancePage from './pages/performance-page'
import RecordPage from './pages/record-page'
import FeedbackPage from './pages/feedback-page'
import SpecificFeedbackPage from './pages/specific-feedback-page'
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
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
