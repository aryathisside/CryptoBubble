import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import BubbleView from './pages/BubbleView';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/PasswordResetPage';
import useConfigStore from './store/useConfigStore';
import Helper from './utils/Helper';
import ChangePassword from './pages/ChangePassword';
import useDataStore from './store/useDataStore';
import UserProfile from './pages/UserProfile';
import DeactivateAccount from './pages/DeactivatePage';
import AnimatedRoutes from '../src/cypto-academy/Components/AnimatedRoutes';
import ScrollToTop from '../src/cypto-academy/Components/ScrollToTop';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import './index.css';

const App = () => {
  const initializeWishlist = useConfigStore((state) => state.initializeWishlist);

  const setIsMobile = useDataStore((state) => state.setIsMobile);
  const isMobile = useDataStore((state) => state.isMobile);

  const { isAuthenticated, logout } = useDataStore();

  // Capture URL query params like token and userEmail
  const location = useLocation();

  const setAuthenticated = useDataStore((state) => state.setAuthenticated);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const userEmail = queryParams.get('userEmail');

    if (token && userEmail) {
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', userEmail);
      setAuthenticated(true); // Update Zustand state
    }
  }, [location.search]);

  useEffect(() => {
    // Handle window resize for mobile detection
    const cleanup = Helper.handleResize(setIsMobile);
    return cleanup;
  }, []);

  useEffect(() => {
    console.log('rendering...');
    // Initialize wishlist state
    initializeWishlist();
  }, [initializeWishlist, isAuthenticated]);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    console.log(token);
    setAuthenticated(!!token); // Update auth status based on token presence
  }, []);

  const isAnimatedRoute = location.pathname.includes('/papertrade');

  return (
    <>
      {isAnimatedRoute ? (
        <div className="App scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-100 bg-black">
          {/* <Router> */}
            <ScrollToTop />
            <AnimatedRoutes />
          {/* </Router */}
        </div>
      ) : (
      
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
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/deactivate-account" element={<DeactivateAccount />} />
        </Routes>
     
      )}
      <ToastContainer />
      {/* </div> */}
    </>
  );
};

export default App;
