import { Routes, Route } from 'react-router-dom';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import UploadPage from '../pages/UploadPage';
import OcrProcessingPage from '../pages/OcrProcessingPage';
import ExtractedRecordPage from '../pages/ExtractedRecordPage';
import ValidationResultsPage from '../pages/ValidationResultsPage';
import VerificationPage from '../pages/VerificationPage';
import RecordSearchPage from '../pages/RecordSearchPage';
import GisMapPage from '../pages/GisMapPage';
import DocumentRepositoryPage from '../pages/DocumentRepositoryPage';
import AuditHistoryPage from '../pages/AuditHistoryPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import UserManagementPage from '../pages/UserManagementPage';
import SettingsPage from '../pages/SettingsPage';
import ProfilePage from '../pages/ProfilePage';
import { Layout } from '../components/layout/Layout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected routes wrapped in layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/processing/:id" element={<OcrProcessingPage />} />
        <Route path="/records" element={<RecordSearchPage />} />
        <Route path="/record/:id" element={<ExtractedRecordPage />} />
        <Route path="/records/:id/validation" element={<ValidationResultsPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/map" element={<GisMapPage />} />
        <Route path="/documents" element={<DocumentRepositoryPage />} />
        <Route path="/audit" element={<AuditHistoryPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}
