import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import IdeaSubmitPage from "./pages/IdeaSubmitPage";
import ReportPage from "./pages/ReportPage";
import ValidationPlanPage from "./pages/ValidationPlanPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/submit" element={<IdeaSubmitPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/validation-plan" element={<ValidationPlanPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
