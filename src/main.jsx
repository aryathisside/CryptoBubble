// index.js
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, useLocation } from 'react-router-dom'; // Import BrowserRouter
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import theme from './theme';
import AuthContextProvider from './Context/AuthContext';
import { store } from './cypto-academy/App/store';
import { Provider } from 'react-redux';
import './index.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

const AppWrapper = () => {
  const location = useLocation(); // Get current route

  // Check if the current route is "/papertrade"
  const isPaperTrade = location.pathname.includes('/papertrade');

  return (
    // Always wrap with AuthContextProvider
    <>
    
      {isPaperTrade ? (
        // Wrap with both Provider and AuthContextProvider for /papertrade route
        <AuthContextProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </AuthContextProvider>
      ) : (
        // Only wrap with AuthContextProvider and ThemeProvider for other routes
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      )}
    </>
  );
};

root.render(
  <Router>

    <AppWrapper />
  </Router>
);
