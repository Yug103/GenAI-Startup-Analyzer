import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import DashboardPage from "./pages/Dashboard";
import IdeaSubmitPage from "./pages/IdeaForm";
import ReportPage from "./pages/Report";
import ValidationPlanPage from "./pages/Validation";
import ValidationListPage from "./pages/ValidationList";

import HomePage from "./pages/Home";

// Main application component defining the React router paths and authentication provider
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/submit" element={<IdeaSubmitPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/validation-plan" element={<ValidationPlanPage />} />
          <Route path="/validations" element={<ValidationListPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
