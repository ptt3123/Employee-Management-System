export interface Staff {
  _id?: string;
  username: string;
  password?: string;
  email: string;
  phoneNumber: string;
  name: string;
  address?: string;
  dob?: string; // ISO string format e.g., '1990-01-01'
  position?: string;
  status: "working" | "inactive" | "resigned";
  teamId?: string; // Sửa lại chỉ dùng string cho thống nhất với formData
}