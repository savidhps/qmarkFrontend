import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getTasksApi, employeeUpdateApi, addRemarkApi } from "../services/allApi";

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

export default function EmployeeDashboard() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = user?.token || localStorage.getItem("token");
  const userId = user?._id || localStorage.getItem("userId");

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newStatus, setNewStatus] = useState("Pending");
  const [newRemarks, setNewRemarks] = useState("");

  // ================= Fetch Tasks =================
  const fetchTasks = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await getTasksApi(token);
      if (res.data?.data) {
        // Filter tasks assigned to this employee
        const myTasks = res.data.data.filter(
          (t) => t.assignedTo && t.assignedTo._id === userId
        );
        setTasks(myTasks);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Unauthorized. Redirecting to login.");
      navigate("/");
      return;
    }
    fetchTasks();
  }, [token]);

  // ================= Open Status/Remarks Modal =================
  const openStatusModal = (task) => {
    setSelectedTask(task);
    setNewStatus(task.status);
    setNewRemarks(""); // new remark input
    setShowStatusModal(true);
  };

  // ================= Update Status & Add Remark =================
  const handleUpdate = async () => {
    if (!selectedTask) return;

    try {
      // Update task status
      await employeeUpdateApi(
        selectedTask._id,
        { status: newStatus },
        token
      );

      // Add new remark if provided
      if (newRemarks.trim()) {
        await addRemarkApi(selectedTask._id, { remark: newRemarks }, token);
      }

      toast.success("Task updated successfully!");
      setShowStatusModal(false);
      setSelectedTask(null);
      setNewRemarks("");

      // Refresh tasks
      fetchTasks();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update task.");
    }
  };

  // ================= Analytics =================
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;

  // ================= JSX =================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 text-lg">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-800">My Task Board</h1>
        <div className="flex items-center gap-4">
          <span className="text-lg font-medium text-indigo-700 hidden sm:block">
            Hello, {user?.name || "Employee"}!
          </span>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-200 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-base">logout</span> Logout
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Total Assigned
          </h2>
          <p className="text-4xl font-bold text-gray-800">{totalTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Completed
          </h2>
          <p className="text-4xl font-bold text-green-600">{completedTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Pending
          </h2>
          <p className="text-4xl font-bold text-yellow-600">{pendingTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            In Progress
          </h2>
          <p className="text-4xl font-bold text-orange-600">{inProgressTasks}</p>
        </div>
      </div>

      {/* Task List */}
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task._id} className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-xl transition duration-300">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-indigo-700 text-lg">{task.title}</h3>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusClasses(task.status)}`}
                  >
                    {task.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2 italic">
                  Remarks:
                  {task.remarks && task.remarks.length > 0
                    ? task.remarks.map((r, i) => (
                        <span key={i} className="block text-gray-700 ml-2">- {r.remark}</span>
                      ))
                    : " N/A"}
                </p>
                <button
                  onClick={() => openStatusModal(task)}
                  className="text-white text-sm font-semibold py-1 px-3 rounded-full bg-indigo-600 hover:bg-indigo-700 transition duration-150 flex items-center gap-1"
                >
                  <span className="material-symbols-rounded text-sm">edit</span>
                  Update Status / Add Remark
                </button>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 italic p-4">
              You have no tasks assigned.
            </p>
          )}
        </div>
      </div>

      {/* Status & Remarks Modal */}
      {showStatusModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Update Task</h2>
            <p className="text-indigo-700 font-semibold mb-6">{selectedTask.title}</p>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="status-select">
                Status
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

              <label className="block text-sm font-medium text-gray-700" htmlFor="remarks-input">
                Add Remark
              </label>
              <textarea
                id="remarks-input"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                placeholder="Add new remark (optional)"
                value={newRemarks}
                onChange={(e) => setNewRemarks(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
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
