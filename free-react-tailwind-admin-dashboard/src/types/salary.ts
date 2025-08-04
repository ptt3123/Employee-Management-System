// Backend response format (theo entities/salary.py)
export interface SalaryBackendResponse {
  employee_id: number;
  salary: number;        // Lương cơ bản
  allowance?: number;    // Phụ cấp  
  reward?: number;       // Thưởng
  detail?: string;       // Chi tiết/Ghi chú
  create_date: string;   // Ngày tạo
  update_date?: string;  // Ngày cập nhật
  
  // Thông tin nhân viên (nếu API trả về)
  employee_name?: string;
  employee_email?: string;
  employee_position?: string;
}

export interface SalaryCreate {
  employee_id: number;   // Backend format
  salary: number;        // Lương cơ bản
  allowance?: number;    // Phụ cấp
  reward?: number;       // Thưởng
  detail?: string;       // Chi tiết
}

export interface SalaryUpdate {
  salary?: number;       // Backend format
  allowance?: number;
  reward?: number;
  detail?: string;
}
