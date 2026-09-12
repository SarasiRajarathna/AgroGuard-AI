import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import NewCase from './pages/farmer/NewCase';
import DiagnosisResult from './pages/farmer/DiagnosisResult';
import OfficerDashboard from './pages/officer/OfficerDashboard';
import CaseDetails from './pages/officer/CaseDetails';
import FieldVisit from './pages/officer/FieldVisit';
import ResearchDashboard from './pages/research/ResearchDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

// Protected Route wrapper that renders with layout
function ProtectedLayout({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
}

// Redirects root "/" to user role dashboard or login
function RootRedirect() {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={`/${user.role}`} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<Login />} />

          {/* Root path */}
          <Route path="/" element={<RootRedirect />} />

          {/* Farmer Routes */}
          <Route
            path="/farmer"
            element={
              <ProtectedLayout>
                <FarmerDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/farmer/dashboard"
            element={
              <ProtectedLayout>
                <FarmerDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/farmer/cases"
            element={
              <ProtectedLayout>
                <FarmerDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/farmer/new-case"
            element={
              <ProtectedLayout>
                <NewCase />
              </ProtectedLayout>
            }
          />
          <Route
            path="/farmer/diagnosis/:caseId"
            element={
              <ProtectedLayout>
                <DiagnosisResult />
              </ProtectedLayout>
            }
          />

          {/* Agriculture Officer Routes */}
          <Route
            path="/officer"
            element={
              <ProtectedLayout>
                <OfficerDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/officer/dashboard"
            element={
              <ProtectedLayout>
                <OfficerDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/officer/cases"
            element={
              <ProtectedLayout>
                <OfficerDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/officer/case/:id"
            element={
              <ProtectedLayout>
                <CaseDetails />
              </ProtectedLayout>
            }
          />
          <Route
            path="/officer/visits"
            element={
              <ProtectedLayout>
                <FieldVisit />
              </ProtectedLayout>
            }
          />
          <Route
            path="/officer/field-visits"
            element={
              <ProtectedLayout>
                <FieldVisit />
              </ProtectedLayout>
            }
          />

          {/* Research Officer Routes */}
          <Route
            path="/research"
            element={
              <ProtectedLayout>
                <ResearchDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/research/dashboard"
            element={
              <ProtectedLayout>
                <ResearchDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/research/outbreaks"
            element={
              <ProtectedLayout>
                <ResearchDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/research/analytics"
            element={
              <ProtectedLayout>
                <ResearchDashboard />
              </ProtectedLayout>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedLayout>
                <AdminDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedLayout>
                <AdminDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedLayout>
                <AdminDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/officers"
            element={
              <ProtectedLayout>
                <AdminDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/alerts"
            element={
              <ProtectedLayout>
                <AdminDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedLayout>
                <AdminDashboard />
              </ProtectedLayout>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </AuthProvider>
  );
}
