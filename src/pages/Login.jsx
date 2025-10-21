import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // --- Placeholder Login Logic ---
    if (email === "manager@taskflow.com" && password === "123456") {
      login("manager");
      navigate("/manager/dashboard");
    } else if (email === "employee@taskflow.com" && password === "123456") {
      login("employee");
      navigate("/employee/dashboard");
    } else {
      console.error("Invalid credentials.");
      alert("Invalid credentials. Try manager@taskflow.com or employee@taskflow.com with password 123456.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-indigo-900 px-4 py-8">
      
      {/* Login Card */}
      <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-sm">
        
        {/* Logo/Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-600 flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-3xl">
              checklist
            </span>
            TaskFlow
          </h1>
          <h2 className="text-lg font-semibold text-gray-700 mt-3">Welcome Back</h2>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left mb-1" htmlFor="email">
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

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left mb-1" htmlFor="password">
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

          {/* Sign In Button (Primary Indigo Theme) */}
          <button
            type="submit"
            className="w-full py-2 mt-5 bg-indigo-600 text-white font-semibold rounded-full shadow-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center gap-2 text-base"
          >
            {/* FIX APPLIED HERE */}
            {/* <span className="material-symbols-rounded text-lg">login</span>  */}
            Sign In to TaskFlow
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-6 text-xs text-gray-600 text-center">
          Don't have an account?{" "}
          <button 
            onClick={() => navigate("/register")}
            className="text-indigo-600 font-semibold hover:text-indigo-800 transition duration-300"
          >
            Register Here
          </button>
        </p>

        {/* Separator for simulated Role-Based links (for demonstration/testing) */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-3 text-gray-500 text-xs font-medium">QUICK TEST ROLES</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        
        {/* Quick Login Links (Styled as links/secondary buttons) */}
        <div className="space-y-2 flex flex-col">
            <span 
                onClick={() => { login("manager"); navigate("/manager/dashboard"); }} 
                className="text-center py-1 text-sm text-purple-600 font-medium cursor-pointer hover:bg-purple-50 rounded-full transition duration-200"
            >
                Test Manager Login
            </span>
            <span 
                onClick={() => { login("employee"); navigate("/employee/dashboard"); }} 
                className="text-center py-1 text-sm text-pink-600 font-medium cursor-pointer hover:bg-pink-50 rounded-full transition duration-200"
            >
                Test Employee Login
            </span>
        </div>
      </div>
    </div>
  );
}