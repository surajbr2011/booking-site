"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        if (res.data?.user) {
          setAdminUser(res.data.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        setAdminUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, [router]);

  /**
   * login — calls backend API which returns user and sets an HTTP-only NextAuth cookie.
   */
  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      
      const user = res.data.user;
      setAdminUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      if (err.response?.status === 401) {
        return { success: false, error: "Invalid credentials." };
      }
      return { success: false, error: "Could not reach the server. Please try again." };
    }
  };

  /**
   * logout — hits the backend endpoint to cleanly destroy the HTTP-only cookie.
   */
  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (err) {
      console.error("Failed to cleanly logout", err);
    }
    setAdminUser(null);
    setIsAuthenticated(false);
    router.push("/admin/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, adminUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

