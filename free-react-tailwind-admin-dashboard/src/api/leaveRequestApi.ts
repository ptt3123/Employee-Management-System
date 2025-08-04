import {
  LeaveRequestCreate,
  LeaveRequestUpdate,
  AdminProcessLeaveRequest,
  AdminGetLeaveRequests,
} from "../types/leave";

const BASE_URL = "https://provided-counseling-preferred-replacement.trycloudflare.com/";

// 🛠 Hàm xử lý lỗi chung
async function handleApiError(res: Response): Promise<never> {
  try {
    const errorData = await res.json();
    console.log("API Error Response:", { status: res.status, errorData });

    if (res.status === 404) {
      throw new Error(errorData.error || "Không tìm thấy đơn nghỉ phép này");
    }

    if (res.status === 422) {
      throw new Error(errorData.detail || "Dữ liệu không hợp lệ");
    }

    if (res.status === 400 && typeof errorData.detail === "object") {
      throw errorData.detail;
    }

    if (typeof errorData.detail === "string") {
      throw new Error(errorData.detail);
    }

    if (typeof errorData.error === "string") {
      throw new Error(errorData.error);
    }

    throw new Error(`Lỗi ${res.status}: ${errorData.message || "Đã xảy ra lỗi không xác định từ server."}`);
  } catch (parseError) {
    if (parseError instanceof Error && parseError.message.includes("Lỗi")) {
      throw parseError;
    }
    throw new Error(`Lỗi ${res.status}: Không thể xử lý phản hồi từ server.`);
  }
}

// 1. Lấy danh sách đơn nghỉ phép của nhân viên (API Staff)
export async function getLeaveRequests(token: string, params?: { page: number; page_size: number }) {
  let url = `${BASE_URL}leave-request/staff/get-leave-requests`;
  if (params) {
    // Chỉ thêm các params có giá trị
    const cleanParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        cleanParams[key] = String(value);
      }
    });
    
    if (Object.keys(cleanParams).length > 0) {
      const query = new URLSearchParams(cleanParams).toString();
      url += `?${query}`;
    }
  }
  console.log("🌐 API Call - getLeaveRequests:", { url, params });
  
  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  
  console.log("📡 getLeaveRequests response status:", res.status);
  if (!res.ok) {
    console.error("❌ getLeaveRequests failed with status:", res.status);
    await handleApiError(res);
  }
  
  const result = await res.json();
  console.log("✅ getLeaveRequests result:", result);
  return result;
}

// 2. Lấy số ngày phép (API Staff)
export async function getQuantityRestDay(token: string) {
  const url = `${BASE_URL}leave-request/get_quantity_rest_day`;
  console.log("🌐 API Call - getQuantityRestDay:", { url });
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  console.log("📡 getQuantityRestDay response status:", res.status);
  if (!res.ok) {
    console.error("❌ getQuantityRestDay failed with status:", res.status);
    await handleApiError(res);
  }
  
  const result = await res.json();
  console.log("✅ getQuantityRestDay result:", result);
  return result;
}

// 3. Tạo đơn nghỉ phép (API Staff)
export async function createLeaveRequest(token: string, data: LeaveRequestCreate) {
  const url = `${BASE_URL}leave-request/create-request`;
  console.log("🌐 API Call - createLeaveRequest:", { url, data });
  
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  console.log("📡 createLeaveRequest response status:", res.status);
  if (!res.ok) {
    console.error("❌ createLeaveRequest failed with status:", res.status);
    await handleApiError(res);
  }
  
  const result = await res.json();
  console.log("✅ createLeaveRequest result:", result);
  return result;
}

// 4. Gửi đơn nghỉ phép (API Staff)
export async function sendLeaveRequest(token: string, leaveRequestId: number) {
  if (!leaveRequestId || leaveRequestId <= 0) {
    throw new Error("ID đơn nghỉ phép không hợp lệ");
  }
  
  const url = `${BASE_URL}leave-request/staff/send-request?leave_request_id=${leaveRequestId}`;
  console.log("🌐 API Call - sendLeaveRequest:", { url, leaveRequestId });
  
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  console.log("📡 sendLeaveRequest response status:", res.status);
  if (!res.ok) {
    console.error("❌ sendLeaveRequest failed with status:", res.status);
    await handleApiError(res);
  }
  
  const result = await res.json();
  console.log("✅ sendLeaveRequest result:", result);
  return result;
}

// 5. Cập nhật đơn nghỉ phép (API Staff)
export async function updateLeaveRequest(token: string, data: LeaveRequestUpdate) {
  const url = `${BASE_URL}leave-request/staff/update-request`;
  console.log("🌐 API Call - updateLeaveRequest:", { url, data });
  
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  console.log("📡 updateLeaveRequest response status:", res.status);
  if (!res.ok) {
    console.error("❌ updateLeaveRequest failed with status:", res.status);
    await handleApiError(res);
  }
  
  const result = await res.json();
  console.log("✅ updateLeaveRequest result:", result);
  return result;
}

// 6. Xóa đơn nghỉ phép (API Staff)
export async function deleteLeaveRequest(token: string, leaveRequestId: string) {
  if (!leaveRequestId || leaveRequestId.trim() === "") {
    throw new Error("ID đơn nghỉ phép không hợp lệ");
  }
  
  const url = `${BASE_URL}leave-request/staff/delete-leave-request/${leaveRequestId}`;
  console.log("🌐 API Call - deleteLeaveRequest:", { url, leaveRequestId });
  
  const res = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  
  console.log("📡 deleteLeaveRequest response status:", res.status);
  if (!res.ok) {
    console.error("❌ deleteLeaveRequest failed with status:", res.status);
    await handleApiError(res);
  }
  
  const result = await res.json();
  console.log("✅ deleteLeaveRequest result:", result);
  return result;
}

// 7. Lấy danh sách đơn nghỉ phép cho admin (có thể truyền params dạng query nếu cần) (API Admin)
export async function getAdminLeaveRequests(token: string, params?: AdminGetLeaveRequests) {
  let url = `${BASE_URL}leave-request/admin/get-requests`;
  if (params) {
    // Whitelist: tất cả parameter mà backend hỗ trợ theo API docs
    const allowedParams = ['name', 'start_date', 'end_date', 'type', 'leave_request_status', 'sort_by', 'sort_value', 'page', 'page_size'];
    const cleanParams: Record<string, string> = {};
    
    Object.entries(params).forEach(([key, value]) => {
      // Chỉ thêm nếu key được phép và có giá trị hợp lệ (không phải empty string)
      if (allowedParams.includes(key) && value !== undefined && value !== null && String(value).trim() !== '') {
        cleanParams[key] = String(value);
      }
    });
    
    if (Object.keys(cleanParams).length > 0) {
      const query = new URLSearchParams(cleanParams).toString();
      url += `?${query}`;
    }
  }
  console.log("🌐 API Call - getAdminLeaveRequests:", { url, params });
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  console.log("📡 getAdminLeaveRequests response status:", res.status);
  if (!res.ok) {
    console.error("❌ getAdminLeaveRequests failed with status:", res.status);
    await handleApiError(res);
  }
  
  const result = await res.json();
  console.log("✅ getAdminLeaveRequests result:", result);
  return result;
}

// 8. Admin xử lý đơn nghỉ phép (API Admin)
export async function processLeaveRequest(token: string, data: AdminProcessLeaveRequest) {
  const url = `${BASE_URL}leave-request/admin/process-leave-request`;
  console.log("🌐 API Call - processLeaveRequest:", { url, data });
  
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  console.log("📡 processLeaveRequest response status:", res.status);
  if (!res.ok) {
    console.error("❌ processLeaveRequest failed with status:", res.status);
    await handleApiError(res);
  }
  
  const result = await res.json();
  console.log("✅ processLeaveRequest result:", result);
  return result;
}

