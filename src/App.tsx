import "./App.css";
import HomePage from "./pages/home-page";
import PerformancePage from "./pages/performance-page";
import RecordPage from "./pages/record-page";
import FeedbackPage from "./pages/feedback-page";
import SpecificFeedbackPage from "./pages/specific-feedback-page";
import MectricsGraphPage from "./pages/metrics-graph-page";
import PracticePage from "./pages/practice-page";
import GrammarFeedbackPage from "./pages/grammar-feedback-page";
import PracticeResultsPage from "./pages/practice-results-page";
import PastConversationPage from "./pages/past-conversation-page";
import { PastConversationsProvider } from "./contexts/PastConversationsContext";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

function App() {
  const location = useLocation();
  return (
    <PastConversationsProvider>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/record" element={<RecordPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route
          path="/specific-feedback/:feedback"
          element={<SpecificFeedbackPage />}
        />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/metrics-graph"
          element={<MectricsGraphPage />}
        />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/grammar-feedback" element={<GrammarFeedbackPage />} />
        <Route path="/practice-results" element={<PracticeResultsPage />} />
        <Route path="/past-conversation/:id" element={<PastConversationPage />} />
      </Routes>
    </PastConversationsProvider>
  );
}

export default App;
