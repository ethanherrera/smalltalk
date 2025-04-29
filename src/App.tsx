import "./App.css";
import HomePage from "./pages/home-page";
import PerformancePage from "./pages/performance-page";
import RecordPage from "./pages/record-page";
import FeedbackPage from "./pages/feedback-page";
import SpecificFeedbackPage from "./pages/specific-feedback-page";
import MectricsGraphPage from "./pages/metrics-graph-page";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

function App() {
  const location = useLocation();
  const metric_type = location.state ? location.state.metric_type : "";
  return (
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
        element={<MectricsGraphPage metric_type={metric_type} />}
      />
    </Routes>
  );
}

export default App;
