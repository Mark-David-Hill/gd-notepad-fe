import { useState, createContext, useEffect } from "react";
import PropTypes from "prop-types";

import fetchWrapper from "../../lib/apiCall";
import { IS_DEMO_MODE } from "../../lib/config";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  // In demo mode there is no API to ask, so the visitor is simply logged out.
  const [isAuthenticated, setIsAuthenticated] = useState(
    IS_DEMO_MODE ? false : null
  );
  const [authInfo, setAuthInfo] = useState(null);

  const checkAuthentication = async () => {
    if (IS_DEMO_MODE) return false;

    try {
      const response = await fetchWrapper.apiCall(`/user/check-login`, "GET");
      setAuthInfo(response.result);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login check failed:", error);
      setAuthInfo(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  const handleLogin = async (email, password) => {
    if (IS_DEMO_MODE) {
      return { success: false, message: "Login is not available in demo mode" };
    }

    const body = { email, password };

    try {
      const response = await fetchWrapper.apiCall(`/user/auth`, "POST", body);
      if (response.message === "login successful") {
        // After successful login, check authentication to get user info
        await checkAuthentication();
        return { success: true };
      } else {
        console.error("Login failed:", response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Login failed" };
    }
  };

  const handleLogout = async () => {
    if (IS_DEMO_MODE) return;

    try {
      await fetchWrapper.apiCall(`/user/logout`, "POST");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAuthInfo(null);
      setIsAuthenticated(false);
    }
  };

  const AuthInfoState = {
    isAuthenticated,
    setIsAuthenticated,
    authInfo,
    setAuthInfo,
    login: handleLogin,
    logout: handleLogout,
    checkAuth: checkAuthentication,
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <AuthContext.Provider value={AuthInfoState}>
      {children}
    </AuthContext.Provider>
  );
}

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
