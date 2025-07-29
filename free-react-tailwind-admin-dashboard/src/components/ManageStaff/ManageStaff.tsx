// ✅ Đã chỉnh sửa: bỏ role, create_date, update_date + hiển thị đầy đủ các cột còn lại từ bảng employee
import React, { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { useModal } from "../../hooks/useModal";
import { Staff } from "../../types/staff";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faEraser } from "@fortawesome/free-solid-svg-icons";

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`border px-3 py-2 rounded-lg w-full ${props.className || ""}`} />
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block mb-1 font-medium">{children}</label>
);

const STAFF_STATUS = [
  { label: "Đang làm việc", value: "working" },
  { label: "Tạm nghỉ", value: "inactive" },
  { label: "Nghỉ việc", value: "resigned" },
];

const MOCK_STAFF: Staff[] = Array.from({ length: 20 }).map((_, index) => ({
  _id: `staff-${index}`,
  username: `user${index}`,
  password: `pass${index}`,
  email: `user${index}@example.com`,
  phoneNumber: `012345678${index}`,
  name: `User ${index}`,
  address: `123 đường ABC`,
  dob: "1990-01-01",
  position: "developer",
  status: "working",
  teamId: `${index % 3 + 1}`,
}));

export default function ManageStaff() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    name: "",
    address: "",
    dob: "",
    position: "",
    status: "working",
    teamId: "",
  });
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState<"username" | "email" | "phoneNumber" | "name">("username");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setStaffList(MOCK_STAFF);
  }, []);

  const filteredStaff = staffList.filter((staff) => {
    return staff[searchField]?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    const staffToSave: Staff = {
      _id: editingStaffId ?? `staff-${Date.now()}`,
      ...(formData as Staff),
    };

    try {
      if (editingStaffId) {
        setStaffList((prev) => prev.map((s) => (s._id === editingStaffId ? staffToSave : s)));
      } else {
        setStaffList((prev) => [...prev, staffToSave]);
      }
      resetForm();
    } catch {
      setErrorMessage("Lỗi không xác định.");
    }
  };

  const handleDelete = (id: string) => {
    setStaffList((prev) => prev.filter((s) => s._id !== id));
  };

  const handleEdit = (staff: Staff) => {
    setFormData({
      username: staff.username ?? "",
      password: staff.password ?? "",
      email: staff.email ?? "",
      phoneNumber: staff.phoneNumber ?? "",
      name: staff.name ?? "",
      address: staff.address ?? "",
      dob: staff.dob ?? "",
      position: staff.position ?? "",
      status: staff.status ?? "working",
      teamId: staff.teamId?.toString() ?? "",
    });
    setEditingStaffId(staff._id || null);
    setFieldErrors({});
    setErrorMessage(null);
    openModal();
  };

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      email: "",
      phoneNumber: "",
      name: "",
      address: "",
      dob: "",
      position: "",
      status: "working",
      teamId: "",
    });
    setFieldErrors({});
    setErrorMessage(null);
    setEditingStaffId(null);
    closeModal();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý nhân viên</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value as any)}
            className="border-2 border-gray-700 px-2 py-1 rounded-lg h-11"
          >
            <option value="username">Username</option>
            <option value="email">Email</option>
            <option value="phoneNumber">Phone</option>
            <option value="name">Name</option>
            <option value="address">Address</option>
            <option value="dob">DOB</option>
            <option value="position">Position</option>
            <option value="teamId">Team</option>
            <option value="status">Status</option>
          </select>
          <Input
            type="text"
            placeholder={`Tìm kiếm theo ${searchField}`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="max-w-sm border-2 border-gray-700 px-2"
          />
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          onClick={() => {
            resetForm();
            openModal();
          }}
        >
          Add Staff
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={resetForm} className="max-w-[800px] m-4">
        <div className="p-6 bg-white rounded-xl dark:bg-gray-900">
          <h4 className="mb-4 text-2xl font-semibold">{editingStaffId ? "Edit Staff" : "Add Staff"}</h4>
          {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {["username", "password", "email", "phoneNumber", "name", "address", "position", "dob", "teamId"].map((name) => (
              <div key={name}>
                <Label>{name}</Label>
                <Input
                  name={name}
                  type={name === "password" ? "password" : name === "dob" ? "date" : "text"}
                  value={(formData as any)[name]}
                  onChange={handleChange}
                />
              </div>
            ))}

            <div>
              <Label>Trạng thái</Label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              >
                {STAFF_STATUS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2 flex justify-end gap-2 mt-6">
              <Button variant="outline" type="button" onClick={resetForm}>Close</Button>
              <Button type="submit">{editingStaffId ? "Update" : "Save"}</Button>
            </div>
          </form>
        </div>
      </Modal>

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-sm">STT</th>
            <th className="border px-2 py-1 text-sm">Username</th>
            <th className="border px-2 py-1 text-sm">Email</th>
            <th className="border px-2 py-1 text-sm">Phone</th>
            <th className="border px-2 py-1 text-sm">Name</th>
            <th className="border px-2 py-1 text-sm">Address</th>
            <th className="border px-2 py-1 text-sm">DOB</th>
            <th className="border px-2 py-1 text-sm">Position</th>
            <th className="border px-2 py-1 text-sm">Team</th>
            <th className="border px-2 py-1 text-sm">Status</th>
            <th className="border px-2 py-1 text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((staff, index) => (
              <tr key={staff._id}>
                <td className="text-center border px-2 py-1">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="text-center border px-2 py-1">{staff.username}</td>
                <td className="text-center border px-2 py-1">{staff.email}</td>
                <td className="text-center border px-2 py-1">{staff.phoneNumber}</td>
                <td className="text-center border px-2 py-1">{staff.name}</td>
                <td className="text-center border px-2 py-1">{staff.address}</td>
                <td className="text-center border px-2 py-1">{staff.dob}</td>
                <td className="text-center border px-2 py-1">{staff.position}</td>
                <td className="text-center border px-2 py-1">{staff.teamId}</td>
                <td className="text-center border px-2 py-1">
                  <select
                    value={staff.status}
                    onChange={e => {
                      const newStatus = e.target.value as Staff["status"];
                      setStaffList(prev =>
                        prev.map(s =>
                          s._id === staff._id ? { ...s, status: newStatus } : s
                        )
                      );
                    }}
                    className={
                      "border rounded px-2 py-1 " +
                      (staff.status === "working"
                        ? "bg-green-100 text-green-700"
                        : staff.status === "inactive"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700")
                    }
                  >
                    {STAFF_STATUS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </td>
                <td className="text-center border px-2 py-1">
                  <button onClick={() => handleEdit(staff)} className="text-blue-600 mr-2">
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button onClick={() => handleDelete(staff._id!)} className="text-red-500">
                    <FontAwesomeIcon icon={faEraser} />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4 gap-2">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Trước</button>
        <span>{currentPage} / {totalPages}</span>
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Sau</button>
      </div>
    </div>
  );
}
