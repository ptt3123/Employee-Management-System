import React, { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { Modal } from "../ui/modal";
import { useModal } from "../../hooks/useModal";
import { Staff } from "../../types/staff";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import {faEraser} from "@fortawesome/free-solid-svg-icons";

// 🧪 Dữ liệu giả định ~20 nhân viên
const MOCK_STAFF: Staff[] = Array.from({ length: 20 }).map((_, index) => ({
  _id: `staff-${index}`,
  username: `user${index}`,
  password: `pass${index}`,
  email: `user${index}@example.com`,
  phoneNumber: `012345678${index}`,
  name: `User ${index}`,
}));

export default function ManageStaff() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    name: "",
  });
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  // 🔍 Tìm kiếm và phân trang
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState<"username" | "password" | "email" | "phoneNumber" | "name">("username");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setStaffList(MOCK_STAFF);
  }, []);

  // 🔎 Lọc nhân viên theo field và giá trị tìm kiếm
  const filteredStaff = staffList.filter((staff) => {
    if (searchField === "name") {
      const fullName = staff.name.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    }
    return staff[searchField]?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    

    const staffToSave: Staff = {
      _id: editingStaffId ?? `staff-${Date.now()}`,
      username: formData.username,
      password: formData.password,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      name: formData.name,
    };

    try {
      if (editingStaffId) {
        setStaffList((prev) =>
          prev.map((s) => (s._id === editingStaffId ? staffToSave : s))
        );
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
    });
    setFieldErrors({});
    setErrorMessage(null);
    setEditingStaffId(null);
    closeModal();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Staff</h1>

      {/* 🔍 Thanh tìm kiếm */}
      <div className="flex flex-cols justify-between items-center mb-4">
        <div className="flex justify-end gap-2 mb-4 items-center">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value as any)}
            className="border-2 border-gray-700 px-2 py-1 rounded-lg h-11"
          >
            <option value="username">Username</option>
            <option value="password">Password</option>
            <option value="email">Email</option>
            <option value="phoneNumber">Phone</option>
            <option value="name">Name</option>
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
          className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          onClick={() => {
            resetForm();
            openModal();
          }}
        >
          Add Staff
        </button>
      </div>

      {/* 🪟 Modal thêm/sửa nhân viên */}
      <Modal isOpen={isOpen} onClose={resetForm} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {editingStaffId ? "Edit Staff" : "Add Staff Information"}
            </h4>
            {errorMessage && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
                {errorMessage}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 px-2">
              {[
                { label: "Username", name: "username" },
                { label: "Password", name: "password", type: "password" },
                { label: "Email", name: "email" },
                { label: "Phone Number", name: "phoneNumber" },
                { label: "Name", name: "name" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <Label>{label}</Label>
                  <Input
                    name={name}
                    type={type || "text"}
                    value={(formData as any)[name]}
                    onChange={handleChange}
                  />
                  {fieldErrors[name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors[name]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={resetForm} type="button">
                Close
              </Button>
              <Button size="sm" type="submit">
                {editingStaffId ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* 📋 Bảng nhân viên */}
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-xl">STT</th>
            <th className="border px-4 py-2 text-xl">Username</th>
            <th className="border px-4 py-2 text-xl">Email</th>
            <th className="border px-4 py-2 text-xl">Phone</th>
            <th className="border px-4 py-2 text-xl">Name</th>
            <th className="border px-4 py-2 text-xl">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((staff, index) => (
              <tr key={staff._id}>
                <td className="text-center border px-4 py-2 text-xl">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="text-center border px-4 py-2 text-xl">{staff.username}</td>
                <td className="text-center border px-4 py-2 text-xl">{staff.email}</td>
                <td className="text-center border px-4 py-2 text-xl">{staff.phoneNumber}</td>
                <td className="text-center border px-4 py-2 text-xl">{staff.name}</td>
                <td className="text-center border px-4 py-2 flex gap-2 justify-center ">
                  <button
                    onClick={() => handleEdit(staff)}
                    className="text-blue-600 hover:underline text-xl"
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button
                    onClick={() => handleDelete(staff._id!)}
                    className="text-red-500 hover:underline text-xl"
                  >
                    <FontAwesomeIcon icon={faEraser} />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* 📄 Phân trang */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Trước
        </button>
        <span className="px-3 py-1">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Sau
        </button>
      </div>
    </div>
  );
}
