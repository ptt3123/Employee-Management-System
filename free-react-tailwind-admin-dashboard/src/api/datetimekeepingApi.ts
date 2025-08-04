import { DayTimeKeeping } from '../types/datetimekeeping';

const BASE_URL = "https://provided-counseling-preferred-replacement.trycloudflare.com/";

// 🛠 Hàm xử lý lỗi chung
async function handleApiError(res: Response): Promise<never> {
  try {
    const errorData = await res.json();
    if (typeof errorData.detail === "string") {
      throw new Error(errorData.detail);
    }
    throw new Error("Đã xảy ra lỗi không xác định từ server.");
  } catch {
    throw new Error("Không thể xử lý phản hồi từ server.");
  }
}

//1. Đăng ký ca làm việc
export async function createDtkRegisForm(token: string, data: DayTimeKeeping[]) {

  console.log("📋 Request Body:", JSON.stringify(data, null, 2));
  
  const res = await fetch(`${BASE_URL}dtk/create_dtk_regis_form`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Error Response Text:", errorText);
    await handleApiError(res);
  }
  
  const responseData = await res.json();
  console.log("📨 Response Data:", JSON.stringify(responseData, null, 2));
  return responseData;
}

//2. Kiểm tra đã đăng ký chưa
export async function checkIfRegisteredDtk(token: string) {
  const res = await fetch(`${BASE_URL}dtk/check_if_registered_dtk`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) await handleApiError(res);
  return res.json();
}

//3. Check-in
export async function checkin(token: string) {
  const res = await fetch(`${BASE_URL}dtk/checkin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) await handleApiError(res);
  return res.json();
}

//4. Check-out
export async function checkout(token: string) {
  const res = await fetch(`${BASE_URL}dtk/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) await handleApiError(res);
  return res.json();
}

//5. Lấy lịch sử chấm công nhân viên (cho admin)
export async function getEmployeeDtkHistory(
  token: string, 
  employeeId: string, 
  year?: string, 
  month?: string
) {
  const queryParams = new URLSearchParams({
    employee_id: employeeId,
    ...(year && { year }),
    ...(month && { month })
  });
  
  const res = await fetch(`${BASE_URL}dtk/get_employee_dtk_history?${queryParams}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) await handleApiError(res);
  return res.json();
}

//6. Lấy lịch sử chấm công của tôi
export async function getMyDtkHistory(token: string, year?: string, month?: string) {
  const queryParams = new URLSearchParams();
  if (year) queryParams.append('year', year);
  if (month) queryParams.append('month', month);
  
  const queryString = queryParams.toString();
  const url = queryString ? `${BASE_URL}dtk/get_my_dtk_history?${queryString}` : `${BASE_URL}dtk/get_my_dtk_history`;
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) await handleApiError(res);
  return res.json();
}

//7. Xóa đăng ký lịch tuần tới
export async function deleteRegisteredScheduleNextWeek(token: string) {
  const res = await fetch(`${BASE_URL}dtk/delete_registered_schedule_next_week`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) await handleApiError(res);
  return res.json();
}