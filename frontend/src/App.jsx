import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import AuthModal from './components/modals/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [authModal, setAuthModal] = useState(null);

  // Simulated Auth State (Replace with JWT logic later)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  // Function to simulate login
  const handleLogin = (userIdent) => {
    setIsAuthenticated(true);
    setUserId(userIdent);
    setAuthModal(null);
  };

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>

        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setAuthModal={setAuthModal}
          isAuthenticated={isAuthenticated}
        />

        <Routes>
          {/* Public Route */}
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage setAuthModal={setAuthModal} />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard userId={userId} />
              </ProtectedRoute>
            }
          />

          {/* Add other protected routes here (e.g., /builder/:tripId, /calendar) */}
        </Routes>

        {authModal && (
          <AuthModal
            authModal={authModal}
            setAuthModal={setAuthModal}
            onLogin={() => handleLogin('USER_8492A')}
          />
        )}
      </div>
    </Router>
  );
}