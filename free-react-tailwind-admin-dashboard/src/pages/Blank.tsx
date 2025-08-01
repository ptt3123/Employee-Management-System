import { useContext, useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { getTeams, createTeam, updateTeam, deleteTeam } from "../api/staffTeamApi";
import { AppContext } from "../context/AppContext";

export default function DepartmentManagement() {
  const { accessToken } = useContext(AppContext)!;
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState<any | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState<any>({ name: "", detail: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách phòng ban từ API
  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    getTeams(accessToken)
      .then((teams) => setDepartments(teams))
      .catch(() => setError("Không thể tải danh sách phòng ban"))
      .finally(() => setLoading(false));
  }, [accessToken]);

  // Phân trang
  const paginatedData = departments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(departments.length / itemsPerPage);

  // Xử lý thêm/sửa phòng ban
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setEditData({ name: "", detail: "" });
    setShowEdit(true);
    setSelectedDept(null);
  };

  const handleEdit = (dept: any) => {
    setEditData({ ...dept });
    setShowEdit(true);
    setSelectedDept(dept);
  };

  const handleDelete = async (dept: any) => {
    if (!accessToken) return;
    if (!window.confirm("Bạn chắc chắn muốn xoá phòng ban này?")) return;
    setLoading(true);
    try {
      await deleteTeam(dept.id, accessToken);
      setDepartments((prev) => prev.filter((d) => d.id !== dept.id));
    } catch {
      setError("Không thể xoá phòng ban.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      if (selectedDept) {
        await updateTeam(editData, accessToken);
        setDepartments((prev) =>
          prev.map((d) => (d.id === editData.id ? { ...d, ...editData } : d))
        );
      } else {
        await createTeam(editData, accessToken);
        // Reload lại danh sách phòng ban
        const teams = await getTeams(accessToken);
        setDepartments(teams);
      }
      setShowEdit(false);
    } catch {
      setError("Không thể lưu phòng ban.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 font-sans">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Quản lý phòng ban</h1>
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          onClick={handleAdd}
        >
          <PlusIcon size={18} />
          Thêm phòng ban
        </button>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : (
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-center">STT</th>
                <th className="border px-4 py-2 text-center">Tên Phòng Ban</th>
                <th className="border px-4 py-2 text-center">Chi tiết</th>
                <th className="border px-4 py-2 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((dept, index) => (
                  <tr key={dept.id} className="border hover:bg-gray-50">
                    <td className="border px-4 py-2 text-center">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="border px-4 py-2 text-center">{dept.name}</td>
                    <td className="border px-4 py-2 text-center">{dept.detail}</td>
                    <td className="border px-4 py-2 text-center space-x-3">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => setSelectedDept(dept)}
                      >
                        Xem chi tiết
                      </button>
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => handleEdit(dept)}
                      >
                        Sửa
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(dept)}
                      >
                        Xoá
                      </button>
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
        )}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Trước
          </button>
          <span className="self-center">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>

      {/* Popup xem chi tiết */}
      {selectedDept && !showEdit && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99998]"
            onClick={() => setSelectedDept(null)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-xl p-8 z-[99999] animate-fade-in">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Chi tiết phòng ban
            </h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <span className="font-semibold">🏢 Tên phòng ban:</span> {selectedDept.name}
              </div>
              <div>
                <span className="font-semibold">📄 Chi tiết:</span> {selectedDept.detail}
              </div>
            </div>
            <div className="text-center mt-6">
              <button
                onClick={() => setSelectedDept(null)}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup thêm/sửa */}
      {showEdit && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99998]"
            onClick={() => setShowEdit(false)}
          ></div>
          <form
            className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-lg p-8 z-[99999] animate-fade-in"
            onSubmit={handleEditSubmit}
          >
            <h3 className="text-xl font-bold mb-6 text-center text-blue-700">
              {selectedDept ? "Sửa phòng ban" : "Thêm phòng ban"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Tên phòng ban</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Chi tiết</label>
                <input
                  type="text"
                  name="detail"
                  value={editData.detail}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-8">
              <button
                type="button"
                className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowEdit(false)}
                disabled={loading}
              >
                Huỷ
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
            {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
          </form>
        </div>
      )}
    </div>
  );
}
