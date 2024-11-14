// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import BubbleView from './pages/BubbleView';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/PasswordResetPage';
import useConfigStore from './store/useConfigStore';


const App = () => {
  const initializeWishlist = useConfigStore((state) => state.initializeWishlist);

  useEffect(() => {
    initializeWishlist();
  }, [initializeWishlist]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Update auth status based on token presence
  }, []);

  return (
    <Router>
      <Routes>
      
          <Route path="/" element={<BubbleView />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
     
   
      </Routes>
    </Router>
  );
};

export default App;
