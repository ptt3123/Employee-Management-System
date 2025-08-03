const BASE_URL = "https://rope-ap-brutal-colony.trycloudflare.com/";

export async function createDtkRegisForm(token: string, data: any) {
  const res = await fetch(`${BASE_URL}dtk/create_dtk_regis_form`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Tạo đăng ký chấm công thất bại");
  return res.json();
}

export async function checkIfRegisteredDtk(token: string) {
  const res = await fetch(`${BASE_URL}dtk/check_if_registered_dtk`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Kiểm tra đăng ký thất bại");
  return res.json();
}

export async function checkin(token: string, data: any) {
  const res = await fetch(`${BASE_URL}dtk/checkin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Checkin thất bại");
  return res.json();
}

export async function checkout(token: string, data: any) {
  const res = await fetch(`${BASE_URL}dtk/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Checkout thất bại");
  return res.json();
}

export async function getEmployeeDtkHistory(token: string, employeeId: string) {
  const res = await fetch(`${BASE_URL}dtk/get_employee_dtk_history?employee_id=${employeeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Lấy lịch sử chấm công nhân viên thất bại");
  return res.json();
}

export async function getMyDtkHistory(token: string) {
  const res = await fetch(`${BASE_URL}dtk/get_my_dtk_history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Lấy lịch sử chấm công của tôi thất bại");
  return res.json();
}

export async function deleteRegisteredScheduleNextWeek(token: string, scheduleId: string) {
  const res = await fetch(`${BASE_URL}dtk/delete_registered_schedule_next_week?schedule_id=${scheduleId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Xóa đăng ký lịch tuần tới thất bại");
  return res.json();
}