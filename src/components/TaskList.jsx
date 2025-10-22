import React from "react";

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

export default function TaskList({ tasks, filterStatus, handleReassign }) {
  const filteredTasks =
    filterStatus === "All"
      ? tasks
      : tasks.filter((t) => t.status === filterStatus);

  return (
    <div className="mb-8 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Assigned Tasks</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-xl transition duration-300"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-indigo-700 text-lg">{task.title}</h3>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusClasses(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Assigned To:</span>{" "}
                {task.assignedTo?.name || "N/A"}
              </p>
              <p className="text-sm text-gray-500 mb-3 italic">
                Remarks: {task.remarks || "N/A"}
              </p>
              <button
                onClick={() => handleReassign(task._id)}
                className="text-indigo-600 text-sm font-semibold py-1 px-3 rounded-full border border-indigo-400 hover:bg-indigo-50 transition duration-150"
              >
                Reassign Task
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 italic p-4">
            No tasks match the current filter.
          </p>
        )}
      </div>
    </div>
  );
}
