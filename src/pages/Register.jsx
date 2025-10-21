import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee'); // Default role is Employee

  const handleRegister = (e) => {
    // e.preventDefault();

    // --- Placeholder Registration Logic ---
    // if (!name || !email || !password || !role) {
    //     alert("Please fill out all fields.");
    //     return;
    // }

    // console.log(`Attempting to register: ${name}, ${email}, Role: ${role}`);
    
    // register(role);
    
    // if (role === 'manager') {
    //     navigate("/manager/dashboard");
    // } else {
    //     navigate("/employee/dashboard");
    // }
    navigate("/login")
  };

  return (
    // Background uses the gradient colors for depth and contrast
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-indigo-900 px-4 py-8">
      
      {/* Registration Card: max-w-sm and reduced padding (p-6) for a smaller footprint */}
      <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-sm">
        
        {/* Logo/Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-600 flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-3xl">
              checklist
            </span>
            TaskFlow
          </h1>
          <h2 className="text-lg font-semibold text-gray-700 mt-3">Create Account</h2>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left mb-1" htmlFor="name">
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

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left mb-1" htmlFor="email">
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

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left mb-1" htmlFor="password">
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

          {/* Role Select */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 text-left mb-1" htmlFor="role">
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
            {/* Custom arrow positioned based on the smaller card size */}
            <span className="material-symbols-outlined absolute right-2 top-8 text-gray-400 pointer-events-none">arrow_drop_down</span>
          </div>


          {/* Register Button (Primary Indigo Theme) */}
          <button
            type="submit"
            className="w-full py-2 mt-5 bg-indigo-600 text-white font-semibold rounded-full shadow-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center gap-2 text-base"
          >
            {/* <span className="material-icons-round text-lg">person_add</span> */}
            Register Account
          </button>
        </form>

        {/* Footer Link */}
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