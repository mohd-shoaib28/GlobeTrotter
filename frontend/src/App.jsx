import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import AuthModal from './components/modals/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ItineraryBuilder from './pages/ItineraryBuilder';
import MyTrips from './pages/MyTrips';
import CreateTrip from './pages/CreateTrip';
import ItineraryView from './pages/ItineraryView';
import BudgetView from './pages/BudgetView';
import UserProfile from './pages/UserProfile';
import SearchPage from './pages/SearchPage';
import Community from './pages/Community';

// Layout wrapper component to handle authenticated layout structure
const AppLayout = ({ children, isAuthenticated, handleLogout }) => {
  const location = useLocation();
  const isAuthRoute = isAuthenticated && location.pathname !== '/';

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Only show when authenticated and not on landing page */}
      {isAuthRoute && <Sidebar handleLogout={handleLogout} />}
      
      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 overflow-hidden w-full ${isAuthRoute ? 'lg:pl-64' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [authModal, setAuthModal] = useState(null);

  // Token and Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');

  // Check token on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('user_id');
    const storedUserName = localStorage.getItem('user_name');
    if (token) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
      setUserName(storedUserName);
    }
  }, []);

  const handleLogin = (id, token, name) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user_id', id);
    localStorage.setItem('user_name', name);
    setIsAuthenticated(true);
    setUserId(id);
    setUserName(name);
    setAuthModal(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    setIsAuthenticated(false);
    setUserId(null);
    setUserName('');
  };

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
        
        <AppLayout isAuthenticated={isAuthenticated} handleLogout={handleLogout}>
          <Navbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            setAuthModal={setAuthModal}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
          />

          <main className="flex-1 overflow-y-auto custom-scrollbar">
            <Routes>
              {/* Public Route */}
              <Route
                path="/"
                element={
                  isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage setAuthModal={setAuthModal} />
                }
              />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Dashboard userId={userId} userName={userName} /></ProtectedRoute>} />
              <Route path="/trips" element={<ProtectedRoute isAuthenticated={isAuthenticated}><MyTrips /></ProtectedRoute>} />
              <Route path="/create-trip" element={<ProtectedRoute isAuthenticated={isAuthenticated}><CreateTrip /></ProtectedRoute>} />
              <Route path="/builder/:tripId" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ItineraryBuilder /></ProtectedRoute>} />
              <Route path="/itinerary/:tripId" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ItineraryView /></ProtectedRoute>} />
              <Route path="/budget/:tripId" element={<ProtectedRoute isAuthenticated={isAuthenticated}><BudgetView /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}><UserProfile /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute isAuthenticated={isAuthenticated}><SearchPage /></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Community /></ProtectedRoute>} />
            </Routes>
          </main>
        </AppLayout>

        {authModal && (
          <AuthModal
            authModal={authModal}
            setAuthModal={setAuthModal}
            onLogin={handleLogin}
          />
        )}
      </div>
    </Router>
  );
}