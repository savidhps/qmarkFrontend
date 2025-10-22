import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../services/allApi";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee"); // default role
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !role) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    const reqBody = { name, email, password, role };

    try {
      const result = await registerApi(reqBody);

      if (result?.status === 200 || result?.status === 201) {
        toast.success("Registration successful! Please login.");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        const message =
          result?.response?.data?.message || "Registration failed. Try again.";
        toast.error(message);
      }
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong during registration."
      );
    } finally {
      setLoading(false);
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
          <h2 className="text-lg font-semibold text-gray-700 mt-3">
            Create Account
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 text-left mb-1"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 text-left mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 text-left mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
              required
            />
          </div>

          {/* Role */}
          <div className="relative">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 text-left mb-1"
            >
              Select Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 appearance-none"
              required
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-8 text-gray-400 pointer-events-none">
              arrow_drop_down
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 mt-5 bg-indigo-600 text-white font-semibold rounded-full shadow-md transition duration-300 flex items-center justify-center gap-2 text-base ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
            }`}
          >
            {loading ? "Creating Account..." : "Register Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-xs text-gray-600 text-center">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 font-semibold hover:text-indigo-800 transition duration-300"
          >
            Sign In Here
          </button>
        </p>
      </div>
    </div>
  );
}
