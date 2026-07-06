/**
 * src/context/AuthContext.jsx
 * Global auth state using React Context API.
 * Provides: user, loading, login, logout, updateUser functions to all children.
 */

import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // True while checking session

  // On app load, check if a session exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data } = await API.get("/auth/me");
        setUser(data.user);
      } catch {
        setUser(null); // Not logged in
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  const login = (userData) => setUser(userData);

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch {
      // Ignore errors on logout
    }
    setUser(null);
  };

  // Used to update user data after profile edits
  const updateUser = (updatedData) =>
    setUser((prev) => ({ ...prev, ...updatedData }));

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming auth context
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
