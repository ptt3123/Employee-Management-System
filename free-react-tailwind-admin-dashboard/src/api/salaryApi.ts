import { SalaryCreate, SalaryUpdate, SalaryBackendResponse } from '../types/salary';

const BASE_URL = "https://provided-counseling-preferred-replacement.trycloudflare.com/";

// 🛠 Hàm xử lý lỗi chung (theo pattern của project)
async function handleApiError(res: Response): Promise<never> {
  try {
    const errorData = await res.json();

    if (res.status === 400 && typeof errorData.detail === "object") {
      throw errorData.detail;
    }

    if (typeof errorData.detail === "string") {
      throw new Error(errorData.detail);
    }

    throw new Error("Đã xảy ra lỗi không xác định từ server.");
  } catch {
    throw new Error("Không thể xử lý phản hồi từ server.");
  }
}

// 🟢 1. Lấy lương theo ID nhân viên (READ API)
export async function getSalaryByEmployeeId(employeeId: number, token: string): Promise<SalaryBackendResponse | null> {
  const res = await fetch(`${BASE_URL}salary/read?employee_id=${employeeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 404) return null;
  if (!res.ok) await handleApiError(res);

  const json = await res.json();

  if (!json.data) {
    return null;
  }

  return json.data;
}

// 🟢 2. Lấy lương nhân viên (READ-EMPLOYEE API)
export async function getEmployeeSalary(employeeId: number, token: string): Promise<SalaryBackendResponse | null> {
  const res = await fetch(`${BASE_URL}salary/read-employee?employee_id=${employeeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 404) return null;
  if (!res.ok) await handleApiError(res);

  const json = await res.json();

  if (!json.data) {
    return null;
  }

  return json.data;
}

// 🟢 3. Cập nhật lương (UPDATE API)
export async function updateSalary(employeeId: number, updates: SalaryUpdate, token: string): Promise<SalaryBackendResponse> {
  const res = await fetch(`${BASE_URL}salary/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      employee_id: employeeId,
      ...updates
    }),
  });

  if (!res.ok) await handleApiError(res);

  const json = await res.json();

  if (json.message !== "success") {
    throw new Error("Không thể cập nhật lương.");
  }

  // Fetch updated salary data
  const updatedSalary = await getSalaryByEmployeeId(employeeId, token);
  if (!updatedSalary) {
    throw new Error("Không thể lấy dữ liệu lương sau khi cập nhật.");
  }

  return updatedSalary;
}

// 🟢 4. Tạo lương mới (CREATE API - chưa có trong backend, dùng update thay thế)
export async function createSalary(salaryData: SalaryCreate, token: string): Promise<SalaryBackendResponse> {
  // Sử dụng API update để tạo mới (vì backend chưa có create API riêng)
  const res = await fetch(`${BASE_URL}salary/update`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(salaryData),
  });

  if (!res.ok) await handleApiError(res);

  const json = await res.json();

  if (json.message !== "success") {
    throw new Error("Không thể tạo lương mới.");
  }

  // Fetch created salary data
  const newSalary = await getSalaryByEmployeeId(salaryData.employee_id, token);
  if (!newSalary) {
    throw new Error("Không thể lấy dữ liệu lương sau khi tạo.");
  }

  return newSalary;
}
