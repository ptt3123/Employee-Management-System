// src/types/leave.ts
export type RequestType = "ANNUAL"  | "MATERNITY" | "PAID" | "PATERNITY" | "UNPAID" | "OTHER";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "WAITING";

// Dùng cho staff, manager, admin
export interface LeaveRequest {
  id: number;
  employee_id: number;
  employee_name?: string; // Optional vì API không luôn trả về (JOIN field)
  manager_id: number | null; // Có thể null như trong backend (nullable=True)
  approver?: string; // Computed field từ manager relationship
  create_date: string;
  start_date: string;
  end_date: string;
  type: RequestType;
  status: RequestStatus;
  detail: string | null; // Backend: nullable=True, có thể null
  update_date: string | null; // Có thể null như backend
  employee?: {
    name: string;
    email: string;
    phone_number: string;
    address: string;
    position: string | null;
  }; // Employee details từ JOIN
  balance?: number; // Số ngày phép còn lại
}

export interface LeaveRequestCreate {
  start_date: string;
  end_date: string;
  type?: RequestType; // Backend: Optional[RequestType], nên optional
  detail: string; // Backend: required str, nên required
}

export interface LeaveRequestUpdate {
  id: number;
  start_date?: string;
  end_date?: string;
  type?: RequestType;
  detail?: string; // Backend: nullable=True, nên optional
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
  leave_request_status?: RequestStatus; // Backend default: RequestStatus.PENDING
  sort_by?: string; // Backend hỗ trợ sort_by
  sort_value?: "ASC" | "DESC"; // Backend hỗ trợ sort_value với dropdown
  page?: number; // Backend default: 1
  page_size?: number; // Backend default: 10
}