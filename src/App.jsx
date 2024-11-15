// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import BubbleView from './pages/BubbleView';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/PasswordResetPage';
import useConfigStore from './store/useConfigStore';
import Helper from './utils/Helper';
import { AppProvider } from './components/context/AppContext';
import ProtectedRoute from './components/context/ProctectedRoute';



const App = () => {
  const initializeWishlist = useConfigStore((state) => state.initializeWishlist);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Handle window resize for mobile detection
    const cleanup = Helper.handleResize(setIsMobile);
    return cleanup;
  }, []);

  useEffect(() => {
    // Initialize wishlist state
    initializeWishlist();
  }, [initializeWishlist]);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');

    setIsAuthenticated(!!token); // Update auth status based on token presence
  }, []);


  return (
    <Router>
    <Routes>
      {/* / route */}
      <Route
        path="/"
        element={
          isMobile && !isAuthenticated ? (
            <LoginPage/> // Redirect to login for mobile view if not authenticated
          ) : (
            <BubbleView />
          )
        }
      />
    
      {/* Other routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Routes>
    </Router>
  );
};

export default App;

