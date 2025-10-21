import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
// Assuming mockEmployees and mockTasks are defined in this file for simplicity, 
// but keeping the import path for the final code structure.
import { mockEmployees, mockTasks } from "../data/mockData";

// Utility function for color-coding status pills
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

export default function ManagerDashboard() {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    // The user name is currently mocked in the AuthContext.
    // We'll use a fallback if user is null for safety.
    const userName = user?.name || "Manager";

    const [tasks, setTasks] = useState(mockTasks);
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", assignedTo: "", status: "Pending", remarks: "" });
    const [filterStatus, setFilterStatus] = useState("All");

    // Enhance mockEmployees with task assignment count
    const employeesWithStats = mockEmployees.map(emp => ({
        ...emp,
        tasksAssigned: tasks.filter(t => t.assignedTo === emp.name).length,
        tasksCompleted: tasks.filter(t => t.assignedTo === emp.name && t.status === "Completed").length,
    }));

    // Add new task
    const handleAddTask = () => {
        if (!newTask.title || !newTask.assignedTo) {
            alert("Please enter title and assign to employee.");
            return;
        }
        setTasks([...tasks, { ...newTask, id: tasks.length + 1 }]);
        setShowModal(false);
        setNewTask({ title: "", assignedTo: "", status: "Pending", remarks: "" });
    };

    // Reassign task
    const handleReassign = (taskId) => {
        const newAssignee = prompt("Enter new employee name for reassigning:");
        if (newAssignee) {
            setTasks(tasks.map(t => t.id === taskId ? { ...t, assignedTo: newAssignee } : t));
        }
    };

    // Filtered tasks
    const filteredTasks = filterStatus === "All" 
        ? tasks 
        : tasks.filter(t => t.status === filterStatus);
    
    // Analytics calculation
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(t => t.status === "Pending").length;
    const inProgressTasks = tasks.filter(t => t.status === "In Progress").length;
    const completedTasks = tasks.filter(t => t.status === "Completed").length;


    return (
        // Use a clean, modern background color
        <div className="p-4 sm:p-8 min-h-screen bg-gray-50"> 
            
            {/* --------------------- Header --------------------- */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                <h1 className="text-3xl font-extrabold text-gray-800">
                    TaskFlow Dashboard
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-lg font-medium text-indigo-700 hidden sm:block">Welcome, {userName}!</span>
                    <button 
                        onClick={() => { logout(); navigate("/"); }} 
                        className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-200 flex items-center gap-1"
                    >
                        <span className="material-symbols-outlined text-base">logout</span>
                        Logout
                    </button>
                </div>
            </div>

            {/* --------------------- Analytics Cards --------------------- */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {/* Total Tasks */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Tasks</h2>
                    <p className="text-4xl font-bold text-gray-800">{totalTasks}</p>
                </div>
                {/* Pending Tasks */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Pending</h2>
                    <p className="text-4xl font-bold text-red-600">{pendingTasks}</p>
                </div>
                {/* In Progress */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">In Progress</h2>
                    <p className="text-4xl font-bold text-yellow-600">{inProgressTasks}</p>
                </div>
                 {/* Completed Tasks */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Completed</h2>
                    <p className="text-4xl font-bold text-green-600">{completedTasks}</p>
                </div>
            </div>

            {/* --------------------- Employee List --------------------- */}
            <div className="mb-10 p-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4 ">Team Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {employeesWithStats.map(emp => (
                        <div key={emp.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200 transition duration-150 hover:shadow-md">
                            <h3 className="font-bold text-indigo-600 text-lg">{emp.name}</h3>
                            <p className="text-sm text-gray-600">Total Tasks: <span className="font-semibold">{emp.tasksAssigned}</span></p>
                            <p className="text-xs text-green-600">Completed: <span className="font-semibold">{emp.tasksCompleted}</span></p>
                        </div>
                    ))}
                </div>
            </div>

            {/* --------------------- Task Controls & List --------------------- */}
            <div className="mb-8 p-6 bg-white rounded-xl shadow-lg">
                
                {/* Task Controls */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Assigned Tasks</h2>
                    <div className="flex gap-4 items-center">
                        {/* Filter Dropdown */}
                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)} 
                            className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-sm appearance-none"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                        {/* Add Task Button */}
                        <button 
                            onClick={() => setShowModal(true)} 
                            className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-base">add_task</span>
                            Add Task
                        </button>
                    </div>
                </div>

                {/* Task List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map(task => (
                            <div key={task.id} className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-xl transition duration-300">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-indigo-700 text-lg">{task.title}</h3>
                                    <span 
                                        className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusClasses(task.status)}`}
                                    >
                                        {task.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">
                                    <span className="font-medium">Assigned To:</span> {task.assignedTo}
                                </p>
                                <p className="text-sm text-gray-500 mb-3 italic">Remarks: {task.remarks || "N/A"}</p>
                                
                                <button 
                                    onClick={() => handleReassign(task.id)} 
                                    className="text-indigo-600 text-sm font-semibold py-1 px-3 rounded-full border border-indigo-400 hover:bg-indigo-50 transition duration-150"
                                >
                                    Reassign Task
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500 italic p-4">No tasks match the current filter.</p>
                    )}
                </div>
            </div>

            {/* --------------------- Add Task Modal --------------------- */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Add New Task</h2>
                        
                        <div className="space-y-4">
                            <input 
                                type="text" 
                                placeholder="Task Title" 
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
                                value={newTask.title} 
                                onChange={(e) => setNewTask({...newTask, title: e.target.value})} 
                                required
                            />
                            
                            <select 
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 appearance-none" 
                                value={newTask.assignedTo} 
                                onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                                required
                            >
                                <option value="" disabled>Assign to Employee</option>
                                {mockEmployees.map(emp => <option key={emp.id} value={emp.name}>{emp.name}</option>)}
                            </select>

                            <select 
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 appearance-none" 
                                value={newTask.status} 
                                onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                            
                            <input 
                                type="text" 
                                placeholder="Initial Remarks" 
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
                                value={newTask.remarks} 
                                onChange={(e) => setNewTask({...newTask, remarks: e.target.value})} 
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button 
                                onClick={() => setShowModal(false)} 
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-150"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleAddTask} 
                                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-150 shadow-md"
                            >
                                Add Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}