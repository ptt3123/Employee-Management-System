// src/types/leave.ts
export type RequestType = "ANNUAL" | "SICK" | "MATERNITY" | "PAID" | "PATERNITY" | "UNPAID" | "OTHER";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "WAITING";

// Dùng cho staff, manager, admin
export interface LeaveRequest {
  id: number;
  employee_id: number;
  employee_name?: string; // Optional vì API không luôn trả về
  manager_id: number | null; // Có thể null như trong response
  approver?: string; // Computed field
  create_date: string;
  start_date: string;
  end_date: string;
  type: RequestType;
  status: RequestStatus;
  detail: string;
  update_date: string | null; // Có thể null
}

export interface LeaveRequestCreate {
  start_date: string;
  end_date: string;
  type?: RequestType;
  detail: string;
}

export interface LeaveRequestUpdate {
  id: number;
  start_date?: string;
  end_date?: string;
  type?: RequestType;
  detail?: string;
}

export interface AdminProcessLeaveRequest {
  id: number;
  status: RequestStatus;
}

export interface AdminGetLeaveRequests {
  name?: string;
  start_date?: string;
  end_date?: string;
  type?: RequestType;
  leave_request_status?: RequestStatus;
  sort_by?: string;
  sort_value?: "ASC" | "DESC";
  page?: number;
  page_size?: number;
}