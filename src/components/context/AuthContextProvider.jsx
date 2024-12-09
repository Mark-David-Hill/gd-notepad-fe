import { useState, createContext, useEffect } from "react";

import fetchWrapper from "../../lib/apiCall";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authInfo, setAuthInfo] = useState(null);

  const checkAuthentication = async () => {
    try {
      const response = await fetchWrapper.apiCall(`/user/check-login`, "GET");
      console.log("auth info?", response.result);
      setAuthInfo(response.result);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const AuthInfoState = {
    isAuthenticated,
    setIsAuthenticated,
    authInfo,
  };

  useEffect(() => {
    const checkAuth = async () => {
      const result = await checkAuthentication();
      setIsAuthenticated(result);
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={AuthInfoState}>
      {children}
    </AuthContext.Provider>
  );
}
