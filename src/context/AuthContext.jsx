import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (role) => setUser({ role, name: role === "manager" ? "Manager Mike" : "Employee Emma" });
  const logout = () => setUser(null);
  const register = (role) => setUser({ role, name: role === "manager" ? "Manager Mike" : "Employee Emma" });

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
