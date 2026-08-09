import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import InterviewSetup from './pages/InterviewSetup';
import TechnicalInterview from './pages/TechnicalInterview';
import HRInterview from './pages/HRInterview';
import Results from './pages/Results';
import InterviewHistory from './pages/InterviewHistory';
import SkillImprovement from './pages/SkillImprovement';

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Hide sidebar on landing page, login, and register
  const publicPaths = ['/', '/login', '/register'];
  const showSidebar = isAuthenticated && !publicPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col font-sans">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 w-full">
        {showSidebar && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all`}>
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/setup"
              element={
                <ProtectedRoute>
                  <InterviewSetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview/technical"
              element={
                <ProtectedRoute>
                  <TechnicalInterview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview/hr"
              element={
                <ProtectedRoute>
                  <HRInterview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results/:interviewId"
              element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <InterviewHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/skill-improvement"
              element={
                <ProtectedRoute>
                  <SkillImprovement />
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
