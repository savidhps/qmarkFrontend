// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { registerApi, loginApi } from "../services/allApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user/token from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        // If JSON parse fails, clear storage
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // ================= REGISTER =================
  const register = async (name, email, password, role) => {
    try {
      const res = await registerApi({ name, email, password, role });
      if (res?.data?.success) {
        const { user, token } = res.data.data;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        setUser(user);
        setToken(token);

        return { success: true, user };
      } else {
        return { success: false, message: res?.response?.data?.message || "Registration failed" };
      }
    } catch (err) {
      console.error("Register error:", err);
      return { success: false, message: "Server error. Try again later." };
    }
  };

  // ================= LOGIN =================
  const login = async (email, password) => {
    try {
      const res = await loginApi({ email, password });
      if (res?.data?.success) {
        const { user, token } = res.data.data;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        setUser(user);
        setToken(token);

        return { success: true, user };
      } else {
        return { success: false, message: res?.response?.data?.message || "Login failed" };
      }
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Server error. Try again later." };
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  // ================= CONTEXT VALUE =================
  const contextValue = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };

  // ✅ Optional safeguard: don't render app until loading is done
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
