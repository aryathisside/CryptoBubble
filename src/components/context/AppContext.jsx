import React, { createContext, useContext, useState, useEffect } from 'react';
import Helper from '../../utils/Helper';
import useDataStore from '../../store/useDataStore';

// Create a Context for Auth and Device state
const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const isMobile = useDataStore((state) => state.isMobile);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
