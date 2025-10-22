import { commonApi } from "./commonApi";
import { serverUrl } from "./serverUrl";

// ====================== AUTH ======================
export const registerApi = async (reqBody) => {
  return await commonApi("POST", `${serverUrl}/auth/register`, reqBody, {
    "Content-Type": "application/json",
  });
};

export const loginApi = async (reqBody) => {
  return await commonApi("POST", `${serverUrl}/auth/login`, reqBody, {
    "Content-Type": "application/json",
  });
};

// ====================== EMPLOYEES ======================
export const getEmployeesApi = async (token) => {
  return await commonApi("GET", `${serverUrl}/employees`, {}, {
    Authorization: `Bearer ${token}`,
  });
};

export const createEmployeeApi = async (reqBody, token) => {
  return await commonApi("POST", `${serverUrl}/employees`, reqBody, {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,  // <-- token must exist
  });
};


export const updateApprovalApi = async (id, approved, token) => {
  return await commonApi("PUT", `${serverUrl}/employees/${id}/approval`, { approved }, {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });
};

// ====================== TASKS ======================
export const getTasksApi = async (token) => {
  return await commonApi("GET", `${serverUrl}/tasks`, {}, {
    Authorization: `Bearer ${token}`,
  });
};

export const createTaskApi = async (reqBody, token) => {
  return await commonApi("POST", `${serverUrl}/tasks`, reqBody, {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });
};

export const addRemarkApi = async (id, remark, token) => {
  return await commonApi("POST", `${serverUrl}/tasks/${id}/remark`, remark, {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });
};

export const employeeUpdateApi = async (id, data, token) => {
  return await commonApi("POST", `${serverUrl}/tasks/${id}/employee-update`, data, {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });
};

export const approveEmployeeApi = async (empId, token) =>
  commonApi("PUT", `${BASE_URL}/employees/approve/${empId}`, {}, {
    Authorization: `Bearer ${token}`,
  });

  