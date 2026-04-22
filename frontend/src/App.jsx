import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateListing from './pages/CreateListing';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Matches from './pages/Matches';
import VerifyEmail from './pages/VerifyEmail';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster />
          <Routes>
            {/* Public landing page — has its own navbar */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth pages - use the app Navbar */}
            <Route
              path="/login"
              element={
                <div className="app-container">
                  <Navbar />
                  <div className="container">
                    <Login />
                  </div>
                </div>
              }
            />
            <Route
              path="/register"
              element={
                <div className="app-container">
                  <Navbar />
                  <div className="container">
                    <Register />
                  </div>
                </div>
              }
            />
            <Route
              path="/verify-email/:token"
              element={
                <div className="app-container">
                  <Navbar />
                  <div className="container">
                    <VerifyEmail />
                  </div>
                </div>
              }
            />

            {/* Protected app pages */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div className="app-container">
                    <Navbar />
                    <div className="container">
                      <Dashboard />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-listing"
              element={
                <ProtectedRoute>
                  <div className="app-container">
                    <Navbar />
                    <div className="container">
                      <CreateListing />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <div className="app-container">
                    <Navbar />
                    <div className="container">
                      <Profile />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/matches"
              element={
                <ProtectedRoute>
                  <div className="app-container">
                    <Navbar />
                    <div className="container">
                      <Matches />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/chat/:pairId"
              element={
                <ProtectedRoute>
                  <div className="app-container">
                    <Navbar />
                    <div className="container">
                      <Chat />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
