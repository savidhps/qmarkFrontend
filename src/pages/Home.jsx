import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Assuming you have a Footer component in your project, similar to the reference.
// If you don't, you'll need to create a simple one or remove this import and the component usage.
// import Footer from "../Components/Footer"; 


const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Function to handle link clicks: closes the mobile menu and navigates via the anchor link
  const handleLinkClick = (hash) => {
    setIsMenuOpen(false); // Close mobile menu when link is clicked
    // Manually navigate to the anchor since 'react-router-dom' links 
    // often prevent default anchor behavior.
    if (hash) {
      setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Service data for mapping in the Services section
  const services = [
    { title: "Task Creation", desc: "Easily create, prioritize, and assign new tasks to team members with a few clicks." },
    { title: "Employee Tracking", desc: "Monitor employee progress, view completion rates, and manage workloads efficiently." },
    { title: "Performance Reports", desc: "Generate insightful reports for managers to evaluate individual and team performance." },
  ];

  // Feature data for mapping in the Features section
    // NOTE: Icons are still defined here for reference but will NOT be rendered in the JSX below.
  const features = [
    { icon: "assignment_ind", title: "Role-Based Access", desc: "Separate views and permissions for Managers and Employees for tailored experience." },
    { icon: "schedule", title: "Deadline Management", desc: "Set clear deadlines and receive automated reminders for all assigned tasks." },
    { icon: "chat", title: "Integrated Messaging", desc: "Communicate directly within tasks to resolve issues and provide feedback quickly." },
    { icon: "bar_chart", title: "Analytics Dashboard", desc: "Visualize team productivity and identify bottlenecks with a comprehensive dashboard." },
  ];

  return (
    <div className="font-sans">
      {/* // ## Header 
      // Using a white header with indigo accents for a professional look, similar to the reference.
      */}
      <header className="bg-white fixed w-full shadow z-50 py-3 border rounded-b-full">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-xl xl:text-2xl font-bold text-indigo-600 flex items-center gap-2 ml-4">
            <span className="material-symbols-outlined text-2xl xl:text-4xl">
              checklist
            </span>
            TaskFlow
          </h1>

          {/* Hamburger Icon (Mobile) */}
          <button
            className="md:hidden text-indigo-600 mr-4 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {/* Using correct Material Symbols class */}
            <span className="material-symbols-rounded text-3xl">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-3 items-center mr-4 p-1">
            {["Home", "Features", "Services", "Contact"].map((item) => (
              <a
                key={item}
                // Using a custom onClick to handle smooth scrolling
                onClick={() => handleLinkClick(`#${item.toLowerCase()}`)} 
                href={`#${item.toLowerCase()}`}
                className="px-4 py-2 rounded-full text-indigo-600 font-medium hover:bg-indigo-600 hover:text-white transition duration-300 cursor-pointer"
              >
                {item}
              </a>
            ))}
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-full border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-600 hover:text-white transition duration-300 cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition duration-300 cursor-pointer"
            >
              Register
            </button>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2 bg-white shadow-lg">
            {["Home", "Features", "Services", "Contact"].map((item) => (
              <a
                key={item}
                onClick={() => handleLinkClick(`#${item.toLowerCase()}`)}
                href={`#${item.toLowerCase()}`}
                className="block px-4 py-2 rounded-full bg-indigo-100 text-indigo-600 font-medium hover:bg-indigo-600 hover:text-white transition duration-300"
              >
                {item}
              </a>
            ))}
            <button
              onClick={() => {
                handleLinkClick();
                navigate("/login");
              }}
              className="block w-full px-4 py-2 rounded-full border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-600 hover:text-white transition duration-300 cursor-pointer text-left"
            >
              Login
            </button>
            <button
              onClick={() => {
                handleLinkClick();
                navigate("/register");
              }}
              className="block w-full px-4 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition duration-300 cursor-pointer text-left"
            >
              Register
            </button>
          </div>
        )}
      </header>
      
      {/* ---
      ## Hero Section
      Using a similar style with a background image/color to simulate the video effect from the reference.
      */}
      <section
        id="home"
        className="relative text-white min-h-screen flex items-center justify-center px-6 text-center pt-32 bg-indigo-700 overflow-hidden"
      >
        {/* Background Overlay Effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 z-0"></div>
        
        {/* Decorative Circle Effect */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500 rounded-full opacity-10 animate-pulse z-0"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-400 rounded-full opacity-10 animate-pulse z-0"></div>


        {/* Content */}
        <div className="relative z-20 max-w-4xl mx-auto">
          <h2 className="text-5xl sm:text-6xl font-extrabold mb-4 drop-shadow-lg">
            TaskFlow: Smart Task Management
          </h2>
          <p className="text-xl mb-8 font-light max-w-2xl mx-auto">
            A seamless platform built for managers and employees to collaborate, track, and achieve goals effortlessly.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold hover:bg-indigo-100 hover:shadow-lg transition inline-block cursor-pointer text-lg shadow-2xl"
          >
            Get Started Now
          </button>
          <div className="mt-16 flex justify-center">
            <a 
              href="#features" 
              onClick={() => handleLinkClick('#features')}
              className="animate-bounce text-white hover:text-indigo-200 transition p-2 rounded-full border border-white"
            >
              <span className="material-symbols-outlined text-4xl">arrow_downward</span>
            </a>
        </div>
      </div>
      </section>

      {/* ---
      ## Features Section (Renamed from About)
      **ICONS REMOVED FROM THIS SECTION**
      --- */}
      <section id="features" className="py-20 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-indigo-600 mb-4">Empower Your Workflow</h3>
          <p className="text-gray-700 max-w-3xl mx-auto mb-12">
            TaskFlow simplifies the complexities of team coordination, ensuring everyone is on the same page and tasks are completed on time.
          </p>
          
          {/* Main Feature Grid (Icons replaced with a decorative circle) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition duration-300 border-t-4 border-indigo-500">
                    {/* ICON REPLACED HERE with a Tailwind-only decorative element */}
                <div className="text-indigo-600 text-4xl mb-3 flex justify-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-indigo-600 rounded-full"></div>
                    </div>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---
      ## Services Section
      Detailing the core functionalities.
      */}
      <section id="services" className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-indigo-600 mb-12">What We Offer</h3>
          <div className="grid gap-8 md:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-indigo-50 shadow-lg rounded-xl p-8 hover:bg-indigo-100 transition duration-300"
              >
                <h4 className="text-2xl font-bold text-indigo-700 mb-4">{service.title}</h4>
                <p className="text-gray-700">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---
      ## Call-to-Action/Documentation Section
      --- */}
      <section className="relative py-24 px-4 bg-indigo-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto grid gap-10 md:grid-cols-2 items-center text-white">
          <div>
            <h4 className="text-xl text-indigo-200 font-semibold mb-2">Ready to Boost Productivity?</h4>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Focus on Results, Not Management</h1>
            <p className="text-indigo-100 mb-6 text-lg">
              Stop juggling spreadsheets and endless emails. TaskFlow provides a unified, intelligent platform for all your organizational needs.
            </p>
            <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center bg-pink-500 text-white px-6 py-3 rounded-full font-bold text-lg hover:bg-pink-600 transition duration-300"
            >
                {/* FIXED: Using material-symbols-rounded for consistency */}
                <span className="material-symbols-rounded align-middle mr-2">login</span>
                Sign In & Start
            </button>
          </div>
          <div className="hidden md:block">
            {/* A simple placeholder icon for visual appeal */}
            <span className="material-symbols-outlined text-9xl text-white/50">
                rocket_launch
            </span>
          </div>
        </div>
      </section>


      {/* ---
      ## Contact Section
      --- */}
      <section id="contact" className="py-20 px-4 bg-gray-50">
        <div className="max-w-xl mx-auto">
          <h3 className="text-3xl font-bold text-indigo-600 mb-6 text-center flex justify-center items-center gap-2">
            {/* FIXED: Using material-symbols-rounded for consistency */}
<span className="material-symbols-outlined text-2xl xl:text-4xl">
              contact_support
            </span>
            Get In Touch
          </h3>
          <p className="text-gray-600 mb-8 text-center">Have a question or need a personalized demo? Send us a message!</p>
          
          <form className="space-y-4 bg-white p-8 rounded-xl shadow-2xl">
            <div>
              <input type="text" placeholder="Your Name" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <input type="email" placeholder="Your Work Email" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <textarea rows="4" placeholder="Your Message" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
            </div>
            <div className="text-center pt-4">
              <button type="submit" className=" bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition duration-300 font-semibold w-full sm:w-auto">
                {/* FIXED: Using material-symbols-rounded for consistency */}
                <span className="material-symbols-rounded align-middle mr-2">send</span>
                Request Demo
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* // ---
      // Footer (Placeholder)
      */}
      {/* <Footer /> */} 
      <footer className="bg-gray-800 text-white text-center p-6">
        <p className="text-gray-400">© 2025 TaskFlow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;