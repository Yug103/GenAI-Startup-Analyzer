import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import IdeaSubmissionPage from './pages/IdeaSubmissionPage';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import DashboardLayout from './layouts/DashboardLayout';
import AnalysisReportPage from './pages/AnalysisReportPage';
import CompetitorDiscoveryPage from './pages/CompetitorDiscoveryPage';
import MarketInsightsPage from './pages/MarketInsightsPage';
import ValidationExperimentPage from './pages/ValidationExperimentPage';
import ReportComparisonPage from './pages/ReportComparisonPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="analyze" element={<IdeaSubmissionPage />} />
          <Route path="login" element={<AuthPage type="login" />} />
          <Route path="signup" element={<AuthPage type="signup" />} />
        </Route>
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="report/:id" element={<AnalysisReportPage />} />
          <Route path="competitors" element={<CompetitorDiscoveryPage />} />
          <Route path="market" element={<MarketInsightsPage />} />
          <Route path="validation" element={<ValidationExperimentPage />} />
          <Route path="compare" element={<ReportComparisonPage />} />
        </Route>

        <Route path="/profile" element={<DashboardLayout />}>
          <Route index element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
