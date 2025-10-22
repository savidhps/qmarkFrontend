import { useContext, useEffect, useState, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getEmployeesApi,
  getTasksApi,
  createTaskApi,
  employeeUpdateApi,
  createEmployeeApi,
  updateApprovalApi
} from "../services/allApi";

// ================= Status Badge Classes =================
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
  const token = user?.token || localStorage.getItem("token");
  const userName = user?.name || localStorage.getItem("name") || "Manager";

  // ================= State =================
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(false);

  // Task Modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    assignedTo: "",
    status: "Pending",
    description: "",
  });

  // Register Employee Modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  // ================= Fetch Employees & Tasks =================
  useEffect(() => {
    if (!token) {
      toast.error("Unauthorized. Redirecting to login.");
      navigate("/");
      return;
    }
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empRes, taskRes] = await Promise.all([getEmployeesApi(token), getTasksApi(token)]);
      const empData = Array.isArray(empRes.data?.data) ? empRes.data.data : [];
      const taskData = Array.isArray(taskRes.data?.data) ? taskRes.data.data : [];
      setEmployees(empData);
      setTasks(taskData);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to fetch employees or tasks.");
    } finally {
      setLoading(false);
    }
  };

  // ================= Helper =================
  const getAssignedToDetails = (assignedToValue) => {
    if (!assignedToValue) return null;
    if (typeof assignedToValue === "object") return assignedToValue;
    return employees.find((emp) => emp._id === assignedToValue) || null;
  };

  // ================= Add Task =================
  const handleAddTask = async () => {
    if (!newTask.title || !newTask.description || !newTask.assignedTo) {
      toast.error("Please enter task title, description, and select employee.");
      return;
    }
    try {
      const res = await createTaskApi(newTask, token);
      if (res.status === 201 || res.status === 200) {
        toast.success("Task added successfully!");
        setShowTaskModal(false);
        setNewTask({ title: "", description: "", assignedTo: "", status: "Pending" });
        fetchData(); // Refresh tasks
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add task.");
    }
  };

  // ================= Reassign Task =================
  const handleReassign = async (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    const currentAssigneeName = getAssignedToDetails(task?.assignedTo)?.name || "Employee";

    const newAssigneeId = prompt(`Enter Employee ID to reassign task (current: ${currentAssigneeName})`);
    if (!newAssigneeId) return;

    try {
      const res = await employeeUpdateApi(taskId, { assignedTo: newAssigneeId }, token);
      if (res.status === 200) {
        setTasks(tasks.map((t) => (t._id === taskId ? res.data : t)));
        toast.success("Task reassigned successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to reassign task.");
    }
  };

  // ================= Register Employee =================
  const handleRegisterEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setRegisterLoading(true);
    try {
      const res = await createEmployeeApi(newEmployee, token);
      if (res.status === 200 || res.status === 201) {
        toast.success("Employee registered successfully!");
        setShowRegisterModal(false);
        setNewEmployee({ name: "", email: "", password: "", role: "employee" });
        fetchData(); // Refresh employees
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to register employee.");
    } finally {
      setRegisterLoading(false);
    }
  };

  // ================= Toggle Approval =================
  const handleToggleApproval = async (empId, currentStatus) => {
    try {
      await updateApprovalApi(empId, !currentStatus, token);
      toast.success(`Employee ${!currentStatus ? "Approved" : "Not Approved"} successfully!`);
      fetchData(); // Refresh employee list
    } catch (err) {
      console.error(err);
      toast.error("Failed to update approval status.");
    }
  };

  // ================= Derived Data =================
  const employeesWithStats = employees.map((emp) => {
    const empTasks = tasks.filter((t) => {
      const assignedId = t.assignedTo?._id || t.assignedTo;
      return assignedId === emp._id;
    });
    return {
      ...emp,
      tasksAssigned: empTasks.length,
      tasksCompleted: empTasks.filter((t) => t.status === "Completed").length,
    };
  });

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;

  const [filterStatus, setFilterStatus] = useState("All");

  // ================= Filtered Tasks =================
  const filteredTasks = useMemo(() => {
    return filterStatus === "All" ? tasks : tasks.filter((t) => t.status === filterStatus);
  }, [tasks, filterStatus]);

  // ================= Loading State =================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-800">TaskFlow Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-lg font-medium text-indigo-700 hidden sm:block">Welcome, {userName}!</span>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-200 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-base">logout</span> Logout
          </button>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Tasks</h2>
          <p className="text-4xl font-bold text-gray-800">{totalTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Pending</h2>
          <p className="text-4xl font-bold text-red-600">{pendingTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">In Progress</h2>
          <p className="text-4xl font-bold text-yellow-600">{inProgressTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Completed</h2>
          <p className="text-4xl font-bold text-green-600">{completedTasks}</p>
        </div>
      </div>

      {/* Team Overview */}
      <div className="mb-10 p-6 bg-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Team Overview</h2>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-200 flex items-center gap-1 text-sm"
          >
            <span className="material-symbols-outlined text-base">person_add</span> Register Employee
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {employeesWithStats.length ? employeesWithStats.map(emp => (
            <div key={emp._id} className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:shadow-md transition duration-150">
              <h3 className="font-bold text-indigo-600 text-lg">{emp.name}</h3>
              <p className="text-sm text-gray-600">Total Tasks: <span className="font-semibold">{emp.tasksAssigned}</span></p>
              <p className="text-xs text-green-600">Completed: <span className="font-semibold">{emp.tasksCompleted}</span></p>

              {/* Approval Toggle */}
              <button
    onClick={() => handleToggleApproval(emp._id, emp.approved)}
    className={`mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md transition duration-300 ease-in-out border 
        ${emp.approved
            ? "bg-green-50 text-green-700 border-green-300 hover:bg-green-100" // Light green badge for Approved
            : "bg-red-50 text-red-700 border-red-300 hover:bg-red-100"     // Light red badge for Needs Review
        }`
    }
    disabled={loading}
>
    {emp.approved ? (
        <span className="material-symbols-outlined text-sm">verified</span>
    ) : (
        <span className="material-symbols-outlined text-sm">visibility</span>
    )}
    {emp.approved ? "Approved" : "Review & Approve"}
</button>
            </div>
          )) : <p className="text-gray-500 italic">No employees found.</p>}
        </div>
      </div>

      {/* Assigned Tasks */}
      <div className="mb-8 p-6 bg-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Assigned Tasks</h2>
          <div className="flex gap-4 items-center">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-sm"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <button
              onClick={() => setShowTaskModal(true)}
              className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">add_task</span> Add Task
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.length ? filteredTasks.map(task => (
            <div key={task._id} className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-xl transition duration-300">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-indigo-700 text-lg">{task.title}</h3>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusClasses(task.status)}`}>{task.status}</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Assigned To: {getAssignedToDetails(task.assignedTo)?.name || "N/A"}</p>
              <p className="text-sm text-gray-500 mb-3 italic">Description: {task.description || "N/A"}</p>
              <button
                onClick={() => handleReassign(task._id)}
                className="text-indigo-600 text-sm font-semibold py-1 px-3 rounded-full border border-indigo-400 hover:bg-indigo-50 transition duration-150"
              >
                Reassign Task
              </button>
            </div>
          )) : <p className="col-span-full text-center text-gray-500 italic p-4">No tasks found.</p>}
        </div>
      </div>

      {/* Modals */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Register New Employee</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Name" value={newEmployee.name} onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })} className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-green-500 focus:border-green-500" />
              <input type="email" placeholder="Email" value={newEmployee.email} onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })} className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-green-500 focus:border-green-500" />
              <input type="password" placeholder="Password" value={newEmployee.password} onChange={e => setNewEmployee({ ...newEmployee, password: e.target.value })} className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-green-500 focus:border-green-500" />
              <select value={newEmployee.role} onChange={e => setNewEmployee({ ...newEmployee, role: e.target.value })} className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-white focus:ring-green-500 focus:border-green-500">
                <option value="employee">Employee</option>
                <option value="manager" disabled>Manager</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowRegisterModal(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-150">Cancel</button>
              <button onClick={handleRegisterEmployee} className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition duration-150 shadow-md" disabled={registerLoading}>{registerLoading ? "Registering..." : "Register"}</button>
            </div>
          </div>
        </div>
      )}

      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Add New Task</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Task Title" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
              <select value={newTask.assignedTo} onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}>
                <option value="" disabled>Select Employee</option>
                {employees.filter(emp => emp.approved).map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
              </select>
              <select value={newTask.status} onChange={e => setNewTask({ ...newTask, status: e.target.value })} className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <input type="text" placeholder="Description" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowTaskModal(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-150">Cancel</button>
              <button onClick={handleAddTask} className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-150 shadow-md">Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
