import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import BubbleView from './pages/BubbleView';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/PasswordResetPage';
import useConfigStore from './store/useConfigStore';
import Helper from './utils/Helper';

const App = () => {
  const initializeWishlist = useConfigStore((state) => state.initializeWishlist);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Capture URL query params like token and userEmail
  const location = useLocation();

  useEffect(() => {
    // Check if token and userEmail are present in the URL query params (after successful Google login)
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const userEmail = queryParams.get('userEmail');

    if (token && userEmail) {
      // Store them in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', userEmail);

      // Set authentication state to true
      setIsAuthenticated(true);
    }
  }, [location.search]);  // Only run this effect when the query params change

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

      <Routes>
        {/* / route */}
        <Route
          path="/"
          element={
            isMobile && !isAuthenticated ? (
              <LoginPage /> // Redirect to login for mobile view if not authenticated
            ) : (
              <BubbleView />
            )
          }
        />

        {/* Other routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>

  );
};

export default App;
