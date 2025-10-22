export default function TeamOverview({ employees, handleApprove }) {
  return (
    <div className="mb-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Team Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.isArray(employees) && employees.length > 0 ? (
          employees.map((emp) => (
            <div
              key={emp._id}
              className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:shadow-md transition duration-150 flex flex-col gap-2"
            >
              <h3 className="font-bold text-indigo-600 text-lg">{emp.name}</h3>
              <p className="text-sm text-gray-600">
                Total Tasks: <span className="font-semibold">{emp.tasksAssigned || 0}</span>
              </p>
              <p className="text-xs text-green-600">
                Completed: <span className="font-semibold">{emp.tasksCompleted || 0}</span>
              </p>
              {!emp.approved && (
                <button
                  onClick={() => handleApprove(emp._id)}
                  className="text-white bg-indigo-600 py-1 px-3 rounded-md text-sm hover:bg-indigo-700 transition"
                >
                  Approve
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No employees found.</p>
        )}
      </div>
    </div>
  );
}
