import {
  LeaveRequestCreate,
  LeaveRequestUpdate,
  AdminProcessLeaveRequest,
  AdminGetLeaveRequests,
} from "../types/leave";

const BASE_URL = "https://rope-ap-brutal-colony.trycloudflare.com/";

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


// 1. Lấy danh sách đơn nghỉ phép của nhân viên (API Staff)
export async function getLeaveRequests(token: string, params?: { page: number; page_size: number }) {
  let url = `${BASE_URL}leave-request/staff/get-leave-requests`;
  if (params) {
    const query = new URLSearchParams(params as any).toString();
    url += `?${query}`;
  }
  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) await handleApiError(res);
  return await res.json();
}

// 2. Lấy số ngày phép còn lại (API Staff)
export async function getQuantityRestDay(token: string) {
  const res = await fetch(`${BASE_URL}leave-request/get_quantity_rest_day`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) await handleApiError(res);
  return await res.json();
}

// 3. Tạo đơn nghỉ phép (API Staff)
export async function createLeaveRequest(token: string, data: LeaveRequestCreate) {
  const res = await fetch(`${BASE_URL}leave-request/create-request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) await handleApiError(res);
  return await res.json();
}

// 4. Gửi đơn nghỉ phép (thường sẽ truyền id hoặc dữ liệu update) (API Staff)
export async function sendLeaveRequest(token: string, data: LeaveRequestUpdate) {
  const res = await fetch(`${BASE_URL}leave-request/staff/send-request`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) await handleApiError(res);
  return await res.json();
}

// 5. Cập nhật đơn nghỉ phép (API Staff)
export async function updateLeaveRequest(token: string, data: LeaveRequestUpdate) {
  const res = await fetch(`${BASE_URL}leave-request/staff/update-request`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) await handleApiError(res);
  return await res.json();
}

// 6. Xóa đơn nghỉ phép (API Staff)
export async function deleteLeaveRequest(token: string, leaveRequestId: string) {
  const res = await fetch(`${BASE_URL}leave-request/staff/delete-leave-request/${leaveRequestId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) await handleApiError(res);
  return await res.json();
}

// 7. Lấy danh sách đơn nghỉ phép cho admin (có thể truyền params dạng query nếu cần) (API Admin)
export async function getAdminLeaveRequests(token: string, params?: AdminGetLeaveRequests) {
  let url = `${BASE_URL}leave-request/admin/get-requests`;
  if (params) {
    const query = new URLSearchParams(params as any).toString();
    url += `?${query}`;
  }
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) await handleApiError(res);
  return await res.json();
}

// 8. Admin xử lý đơn nghỉ phép (API Admin)
export async function processLeaveRequest(token: string, data: AdminProcessLeaveRequest) {
  const res = await fetch(`${BASE_URL}leave-request/admin/process-leave-request`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) await handleApiError(res);
  return await res.json();
}

