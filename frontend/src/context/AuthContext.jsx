import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initLoading, setInitLoading] = useState(true);

  // --- Initialize Auth State on App Start ---
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        // Set default header for all requests immediately
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        try {
          // Verify token and get fresh user data from backend
          // We use /users/profile to ensure the token is still valid
          const { data } = await api.get("/users/profile");
          setUser(data);
        } catch (error) {
          console.error("Session expired or invalid token:", error);
          // If token is invalid, clear everything to prevent loops
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          delete api.defaults.headers.common["Authorization"];
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setInitLoading(false);
    };

    initializeAuth();
  }, []);

  // --- Login Action ---
  const login = (userData) => {
    // 1. Update State
    setUser(userData);

    // 2. Ensure header is set for subsequent requests
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    // 3. Store basic info in localStorage
    localStorage.setItem("userInfo", JSON.stringify(userData));
  };

  // --- Logout Action ---
  const logout = () => {
    // 1. Remove data from storage
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");

    // 2. Clear Axios header
    delete api.defaults.headers.common["Authorization"];

    // 3. Update State to trigger immediate UI re-render
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        initLoading,
      }}
    >
      {/* Only render children after initialization check is done */}
      {!initLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
