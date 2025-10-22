// src/pages/Login.jsx
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ If already logged in, redirect automatically
  useEffect(() => {
    if (user?.role === "manager") navigate("/manager/dashboard");
    else if (user?.role === "employee") navigate("/employee/dashboard");
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user.role === "manager") {
        navigate("/manager/dashboard");
      } else if (res.user.role === "employee") {
        navigate("/employee/dashboard");
      } else {
        alert("Unknown role. Please contact admin.");
      }
    } else {
      alert(res.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-indigo-900 px-4 py-8">
      <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-600 flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-3xl">checklist</span>
            TaskFlow
          </h1>
          <h2 className="text-lg font-semibold text-gray-700 mt-3">Welcome Back</h2>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 text-left mb-1"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 text-left mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 mt-5 bg-indigo-600 text-white font-semibold rounded-full shadow-md transition duration-300 flex items-center justify-center gap-2 text-base ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
            }`}
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                Signing In...
              </>
            ) : (
              "Sign In to TaskFlow"
            )}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-xs text-gray-600 text-center">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-indigo-600 font-semibold hover:text-indigo-800 transition duration-300"
          >
            Register Here
          </button>
        </p>
      </div>
    </div>
  );
}
