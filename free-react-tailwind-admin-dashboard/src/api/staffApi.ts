import { Staff } from "../types/staff";

const BASE_URL = "https://gras-horse-iron-neural.trycloudflare.com/";

// 🛠 Hàm xử lý lỗi chung
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

// 🟢 1. Đăng nhập nhân viên
export async function loginStaff(credentials: { username: string; password: string }): Promise<{ access_token: string; token_type: string }> {
  const params = new URLSearchParams();
  params.append("username", credentials.username);
  params.append("password", credentials.password);
  console.log(params.toString());
  const res = await fetch(`${BASE_URL}employee/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) await handleApiError(res);
  return await res.json();
}


// 🟢 2. Tạo nhân viên mới (Admin)
export async function createStaff(staff: Staff, token: string): Promise<Staff> {
  const res = await fetch(`${BASE_URL}employee/create-employee`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(staff),
  });

  if (!res.ok) await handleApiError(res);
  return await res.json();
}

// 🟢 3. Cập nhật mật khẩu
export async function changePassword(data: { old_password: string; new_password: string }, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}employee/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) await handleApiError(res);
}

// 🟢 4. Cập nhật nhân viên (Admin)
export async function updateStaff(employeeId: string, updatedData: Partial<Staff>, token: string): Promise<void> {
  console.log("update date:", updatedData);
  const res = await fetch(`${BASE_URL}employee/admin/update-employee/${updatedData.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) await handleApiError(res);
}


// 🟢 5. Lấy danh sách nhân viên
export async function getAllStaff(
  token: string,
  page: number = 1,
  pageSize: number = 10,
  teamId?: string | null,
  searchBy?: string,
  searchValue?: string,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC",
  employeeStatus?: string
): Promise<{ employees: Staff[]; total_pages: number }> {
  const query = new URLSearchParams();

  query.append("page", page.toString());
  query.append("page_size", pageSize.toString());

  if (teamId) query.append("team_id", teamId);
  if (searchBy && searchValue) {
    query.append("search_by", searchBy);
    query.append("search_value", searchValue);
  }
  if (sortBy) query.append("sort_by", sortBy);
  if (sortOrder) query.append("sort_value", sortOrder);
  if (employeeStatus) query.append("employee_status", employeeStatus);
  const res = await fetch(`${BASE_URL}employee/get-employees?${query.toString()}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
  });

  const text = await res.text();
  const json = JSON.parse(text);

  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.error || "Không thể lấy danh sách nhân viên.");
  }

  const rawList = json.data.employees;
  const totalPages = json.data.total_pages ?? 1;

  const employees = rawList.map((item: any) => ({
    id: item.id,
    team_id: item.team_id,
    position: item.position,
    name: item.name,
    email: item.email,
    phone_number: item.phone_number,
    status: item.status,
    address: item.address,
    dob: item.dob,
    username: item.username,
    team_name: item.team_name,
    is_working: item.is_working,
  }));

  return { employees, total_pages: totalPages };
}
