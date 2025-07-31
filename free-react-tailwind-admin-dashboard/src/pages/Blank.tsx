import { useState } from "react";
import { PlusIcon } from "lucide-react";

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: "Phòng Kỹ Thuật",
      detail: "Phụ trách kỹ thuật phần mềm",
    },
    {
      id: 2,
      name: "Phòng Nhân Sự",
      detail: "Quản lý tuyển dụng và phúc lợi",
    },
  ]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Quản lý phòng ban</h1>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">
          <PlusIcon size={18} />
          Thêm phòng ban
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50 text-gray-700 text-sm font-medium">
            <tr>
              <th className="px-6 py-3 text-left">STT</th>
              <th className="px-6 py-3 text-left">Tên Phòng Ban</th>
              <th className="px-6 py-3 text-left">Chi tiết</th>
              <th className="px-6 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {departments.length > 0 ? (
              departments.map((dept, index) => (
                <tr key={dept.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">{index + 1}</td>
                  <td className="px-6 py-3">{dept.name}</td>
                  <td className="px-6 py-3">{dept.detail}</td>
                  <td className="px-6 py-3 text-center space-x-3">
                    <button className="text-blue-600 hover:underline">Sửa</button>
                    <button className="text-red-600 hover:underline">Xoá</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  Không có dữ liệu phòng ban.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
