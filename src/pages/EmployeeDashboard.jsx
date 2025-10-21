import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { mockTasks } from "../data/mockData";

// Utility function for color-coding status pills (reused from ManagerDashboard)
const getStatusClasses = (status) => {
    switch (status) {
        case "Completed":
            return "bg-green-100 text-green-700 border-green-300";
        case "In Progress":
            return "bg-yellow-100 text-yellow-700 border-yellow-300";
        case "Pending":
        default:
            return "bg-red-100 text-red-700 border-red-300";
    }
};

export default function EmployeeDashboard() {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Safety check for user name. For true mock data, use a specific name for filtering.
    const userName = user?.name || "Employee"; 

    // Filter tasks assigned to the current user (if user is defined and has a name)
    const [tasks, setTasks] = useState(() => 
        mockTasks.filter(t => t.assignedTo === userName)
    );

    // State for the status update modal
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [newStatus, setNewStatus] = useState("Pending");

    // Open modal and set initial status
    const openStatusModal = (task) => {
        setSelectedTask(task);
        setNewStatus(task.status);
        setShowStatusModal(true);
    };

    // Handle status update submission
    const handleStatusUpdate = () => {
        if (!selectedTask || !newStatus) return;

        setTasks(tasks.map(t => 
            t.id === selectedTask.id ? { ...t, status: newStatus } : t
        ));

        // Clear and close modal
        setShowStatusModal(false);
        setSelectedTask(null);
    };

    // Calculate analytics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "Completed").length;
    const pendingTasks = tasks.filter(t => t.status === "Pending").length;


    return (
        <div className="p-4 sm:p-8 min-h-screen bg-gray-50"> 
            
            {/* --------------------- Header --------------------- */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                <h1 className="text-3xl font-extrabold text-gray-800">
                    My Task Board
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-lg font-medium text-indigo-700 hidden sm:block">Hello, {userName}!</span>
                    <button 
                        onClick={() => { logout(); navigate("/"); }} 
                        className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-200 flex items-center gap-1"
                    >
                        <span className="material-symbols-rounded text-base">logout</span>
                        Logout
                    </button>
                </div>
            </div>

            {/* --------------------- Analytics Cards --------------------- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Total Tasks */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Assigned</h2>
                    <p className="text-4xl font-bold text-gray-800">{totalTasks}</p>
                </div>
                {/* Completed Tasks */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Completed</h2>
                    <p className="text-4xl font-bold text-green-600">{completedTasks}</p>
                </div>
                {/* Pending Tasks */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Pending</h2>
                    <p className="text-4xl font-bold text-yellow-600">{pendingTasks}</p>
                </div>
            </div>

            {/* --------------------- Task List --------------------- */}
            <div className="p-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Tasks</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.length > 0 ? (
                        tasks.map(task => (
                            <div key={task.id} className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-xl transition duration-300">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-indigo-700 text-lg">{task.title}</h3>
                                    <span 
                                        className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusClasses(task.status)}`}
                                    >
                                        {task.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-3 italic">Remarks: {task.remarks || "N/A"}</p>
                                
                                <button 
                                    onClick={() => openStatusModal(task)} 
                                    className="text-white text-sm font-semibold py-1 px-3 rounded-full bg-indigo-600 hover:bg-indigo-700 transition duration-150 flex items-center gap-1"
                                >
                                    <span className="material-symbols-rounded text-sm">edit</span>
                                    Update Status
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500 italic p-4">You have no tasks assigned.</p>
                    )}
                </div>
            </div>

            {/* --------------------- Status Update Modal --------------------- */}
            {showStatusModal && selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Update Status for:</h2>
                        <p className="text-indigo-700 font-semibold mb-6">{selectedTask.title}</p>
                        
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="status-select">
                                New Status
                            </label>
                            <select 
                                id="status-select"
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 appearance-none" 
                                value={newStatus} 
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button 
                                onClick={() => setShowStatusModal(false)} 
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-150"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleStatusUpdate} 
                                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-150 shadow-md"
                            >
                                Confirm Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}