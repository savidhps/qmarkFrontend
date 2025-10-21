import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import { AuthProvider, AuthContext } from "./context/AuthContext";

// Protected route wrapper
const ProtectedRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/manager/*"
            element={
              <ProtectedRoute role="manager">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/*"
            element={
              <ProtectedRoute role="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
