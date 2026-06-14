import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ForgotPasswordPage from "./pages/ForgotPassword";
import DashboardPage from "./pages/Dashboard";
import IdeaSubmitPage from "./pages/IdeaForm";
import ReportPage from "./pages/Report";
import ValidationPlanPage from "./pages/Validation";
import ValidationListPage from "./pages/ValidationList";
import ComparePage from "./pages/Compare";
import HomePage from "./pages/Home";
import { Analytics } from '@vercel/analytics/react';

// Main application component defining the React router paths and authentication provider
function App() {
  return (
    <>
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/submit" element={<ProtectedRoute><IdeaSubmitPage /></ProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
          <Route path="/validation-plan" element={<ProtectedRoute><ValidationPlanPage /></ProtectedRoute>} />
          <Route path="/validations" element={<ProtectedRoute><ValidationListPage /></ProtectedRoute>} />
          <Route path="/compare" element={<ProtectedRoute><ComparePage /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
      <Analytics />
    </>
  );
}

export default App;
