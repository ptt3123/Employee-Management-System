import { Staff } from "../types/staff";

const BASE_URL = "http://localhost:5001";

// 🛠 Hàm xử lý lỗi chung
async function handleApiError(res: Response): Promise<never> {
  try {
    const errorData = await res.json();

    // Trường hợp lỗi dạng object (thường là 400)
    if (res.status === 400 && typeof errorData.detail === "object") {
      throw errorData.detail; // lỗi từng trường (username/email/...)
    }

    // Trường hợp lỗi chuỗi
    if (typeof errorData.detail === "string") {
      throw new Error(errorData.detail);
    }

    throw new Error("Đã xảy ra lỗi không xác định từ server.");
  } catch {
    throw new Error("Không thể xử lý phản hồi từ server.");
  }
}

// 🟢 1. Đăng ký nhân viên mới
export async function createStaff(staff: Staff): Promise<Staff> {
  const res = await fetch("http://localhost:5001/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(staff),
  });

  if (!res.ok) {
    const err = await res.json();

    // 👉 Nếu backend trả detail là object (field errors), ném nguyên object
    if (typeof err.detail === "object") throw err.detail;

    // 👉 Nếu backend trả lỗi là chuỗi
    if (typeof err.detail === "string") throw new Error(err.detail);

    throw new Error("Lỗi không xác định khi tạo nhân viên.");
  }

  const data = await res.json();
  return data.data?.user ?? data;
}


/* 🟢 2. Lấy thông tin nhân viên theo ID
export async function getStaffById(id: String): Promise<Staff> {
  const res = await fetch(`${BASE_URL}/read/${id}`);
  if (!res.ok) await handleApiError(res);
  const data = await res.json();
  return data;
} */

export async function getAllStaff(): Promise<Staff[]> {
  const res = await fetch(`${BASE_URL}/getall`);
  if (!res.ok) await handleApiError(res);
  const data = await res.json();
  return data;
}
// 🟢 3. Cập nhật mật khẩu nhân viên
// 🟢 Cập nhật toàn bộ thông tin nhân viên
export async function updateStaff(employeeId: string, updatedData: Partial<Staff>): Promise<void> {
  const res = await fetch(`${BASE_URL}/update/${employeeId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) await handleApiError(res);
}


// 🟢 4. Xoá nhân viên theo ID
export async function deleteStaff(id: String): Promise<void> {
  const res = await fetch(`${BASE_URL}/delete/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) await handleApiError(res);
}

