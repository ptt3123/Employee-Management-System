// components/StaffTable.tsx
import React, { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { useModal } from "../../hooks/useModal";
import { Staff } from "../../types/staff";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faEraser } from "@fortawesome/free-solid-svg-icons";
import { getAllStaff } from "../../api/staffApi"; // Giả định bạn có API

interface Props {
  token: string;
}

export default function StaffTable({ token }: Props) {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    async function fetchStaff() {
      try {
        const data = await getAllStaff(token);
        setStaffList(data);
      } catch (error) {
        console.error("Lỗi lấy nhân viên:", error);
      }
    }

    fetchStaff();
  }, [token]);

  const handleEdit = (staff: Staff) => {
    setSelectedStaff(staff);
    openModal();
  };

  const handleDelete = (staff: Staff) => {
    if (window.confirm(`Bạn có chắc muốn xóa nhân viên ${staff.name}?`)) {
      // TODO: Gọi API xóa ở đây
      alert("Đã xóa giả lập");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Danh sách nhân viên</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Tên</th>
            <th className="border px-2 py-1">Username</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">SĐT</th>
            <th className="border px-2 py-1">Team</th>
            <th className="border px-2 py-1">Vị trí</th>
            <th className="border px-2 py-1">Trạng thái</th>
            <th className="border px-2 py-1">Đang làm việc</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff) => (
            <tr key={staff._id} className="text-center">
              <td className="border px-2 py-1">{staff.name}</td>
              <td className="border px-2 py-1">{staff.email}</td>
              <td className="border px-2 py-1">{staff.phone_number}</td>
              <td className="border px-2 py-1">{staff.status}</td>
              <td className="border px-2 py-1">
                <div
                  className={`w-3 h-3 rounded-full mx-auto ${
                    staff.is_working ? "bg-green-500" : "bg-red-500"
                  }`}
                  title={staff.is_working ? "Đang làm việc" : "Không làm việc"}
                ></div>
              </td>
              <td className="border px-2 py-1 flex justify-center gap-3">
                <Button onClick={() => handleEdit(staff)}>
                  <FontAwesomeIcon icon={faPenToSquare} className="text-blue-600" />
                </Button>
                <Button onClick={() => handleDelete(staff)}>
                  <FontAwesomeIcon icon={faEraser} className="text-red-600" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Sửa Nhân Viên */}
      {isOpen && selectedStaff && (
        <Modal title="Chỉnh sửa nhân viên" onClose={closeModal}>
          <div className="space-y-4">
            <p><strong>Tên:</strong> {selectedStaff.name}</p>
            <p><strong>Email:</strong> {selectedStaff.email}</p>
            {/* TODO: Form chỉnh sửa */}
            <Button onClick={closeModal} className="mt-4">Đóng</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
