export interface Staff {
  _id?: string;
  team_id?: string; // Sửa lại chỉ dùng string cho thống nhất với formData
  position?: string;
  name: string;
  email: string;
  phone_number: string;
  status: "active" | "resigned" | "terminated" | "retired"; // Chỉ sử dụng 3 trạng thái này
  address?: string;
  dob?: string; // ISO string format e.g., '1990-01-01'
  username: string;
  team_name?: string; // Tên nhóm, có thể không cần nếu không sử dụng
  is_working?: boolean; // Chỉ sử dụng khi lấy từ API, không cần trong formData
}