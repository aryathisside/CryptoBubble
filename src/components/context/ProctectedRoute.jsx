import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "./AppContext";

const ProtectedRoute = ({ children}) => {
    const location = useLocation();
    const { isAuthenticated, isMobile } = useAppContext(); // Access context

    useEffect(() => {
        console.log('isMobile:', isMobile);
        console.log('isAuthenticated:', isAuthenticated);
      }, [isMobile, isAuthenticated]);

  
  
    // Redirect to login if not authenticated and on mobile
    if (isMobile && !isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} />;
    }
  
    return children;
  };

  export default ProtectedRoute