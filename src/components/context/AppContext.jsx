import React, { createContext, useContext, useState, useEffect } from 'react';
import Helper from '../../utils/Helper';

// Create a Context for Auth and Device state
const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
   
    // Handle window resize for mobile detection
    const cleanup = Helper.handleResize(setIsMobile);
    return cleanup;
  }, []);

  // Check authentication status
  useEffect(() => {
   
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <AppContext.Provider value={{ isMobile, isAuthenticated }}>
      {children}
    </AppContext.Provider>
  );
};
