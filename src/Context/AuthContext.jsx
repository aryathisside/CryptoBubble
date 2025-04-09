import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import Loader from "../cypto-academy/Components/Loader";
import { supabase } from "../cypto-academy/Utils/init-supabase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Logout
  function logout() {
    localStorage.removeItem("token");
    setCurrentUser(null);
  }

  // Check Authentication State on Load
  useEffect(() => {
    const checkAuthState = async () => {
      const token = localStorage.getItem("token");
      const firstName = localStorage.getItem("firstName");
      const lastName = localStorage.getItem("lastName");
      if (token) {
        try {
          const decoded = jwtDecode(token);

          // Format user data and set as current user
          const formatted = {
            uid: decoded.id,
            email: decoded.email,
            displayName: firstName+' '+lastName,
          };
          setCurrentUser(formatted);
        } catch (error) {
          console.error("Error during user check:", error);
          logout(); // Log out user on token decode failure
        }
      }
      setAuthLoading(false);
    };

    checkAuthState(); // Call the async function
  }, []);

  const value = {
    currentUser,
    logout,
  };

  if (authLoading) {
    return <Loader message="Checking if you logged in before...." />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
