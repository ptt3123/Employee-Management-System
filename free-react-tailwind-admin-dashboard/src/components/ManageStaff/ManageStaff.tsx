import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import {
  createStaff,
  deleteStaff,
  getAllStaff,
  updateStaff,
} from "../../api/staffApi";
import { Staff } from "../../types/staff";

export default function ManageStaff() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [formData, setFormData] = useState<Omit<Staff, "_id">>({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
  });
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof Staff, string>>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    loadStaffList();
  }, []);

  const loadStaffList = async () => {
    try {
      const results = await getAllStaff();
      setStaffList(results);
    } catch {
      setErrorMessage("Không thể tải danh sách nhân viên.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    try {
      if (editingStaffId) {
        await updateStaff(editingStaffId, formData);
      } else {
        await createStaff(formData as Staff);
      }

      await loadStaffList();
      resetForm();
    } catch (err: any) {
      if (typeof err === "object" && err !== null && !("message" in err)) {
        setFieldErrors(err);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else if (typeof err === "string") {
        setErrorMessage(err);
      } else {
        setErrorMessage("Đã xảy ra lỗi không xác định.");
      }
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await deleteStaff(id);
      await loadStaffList();
    } catch (err: any) {
      setErrorMessage(err.message || "Xoá thất bại");
    }
  };

  const handleEdit = (staff: Staff) => {
    const { _id, ...rest } = staff;
    setFormData(rest);
    setEditingStaffId(_id);
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
      firstName: "",
      lastName: "",
    });
    setFieldErrors({});
    setErrorMessage(null);
    setEditingStaffId(null);
    closeModal();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Staff</h1>

      <button
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        onClick={() => {
          resetForm();
          openModal();
        }}
      >
        Add Staff
      </button>

      <Modal isOpen={isOpen} onClose={resetForm} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {editingStaffId ? "Edit Staff" : "Add Staff Information"}
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              {editingStaffId
                ? "Update existing staff details."
                : "Add a new staff member to the system."}
            </p>

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
                { label: "First Name", name: "firstName" },
                { label: "Last Name", name: "lastName" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <Label>{label}</Label>
                  <Input
                    name={name}
                    type={type || "text"}
                    value={(formData as any)[name]}
                    onChange={handleChange}
                  />
                  {fieldErrors[name as keyof Staff] && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors[name as keyof Staff]}
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

      {errorMessage && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
          {errorMessage}
        </div>
      )}

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">First Name</th>
            <th className="border px-4 py-2">Last Name</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff) => (
            <tr key={staff._id}>
              <td className="border px-4 py-2">{staff.username}</td>
              <td className="border px-4 py-2">{staff.email}</td>
              <td className="border px-4 py-2">{staff.phoneNumber}</td>
              <td className="border px-4 py-2">{staff.firstName}</td>
              <td className="border px-4 py-2">{staff.lastName}</td>
              <td className="border px-4 py-2 flex gap-2">
                <button
                  onClick={() => handleEdit(staff)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(staff._id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
