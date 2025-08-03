import { useEffect, useState, useContext } from "react";
import {
  getLeaveRequests,
  deleteLeaveRequest,
  createLeaveRequest,
  sendLeaveRequest,
  updateLeaveRequest,
  getQuantityRestDay, 
} from "../../api/leaveRequestApi";
import { AppContext } from "../../context/AppContext";
import LeaveRequestCreateModal from "./LeaveRequestCreateModal";
import { RequestType, LeaveRequest } from "../../types/leave";

const requestTypes = [
  { value: "ANNUAL", label: "Nghỉ phép năm" },
  { value: "MATERNITY", label: "Nghỉ thai sản" },
  { value: "PATERNITY", label: "Nghỉ chăm sóc con" },
  { value: "SICK", label: "Nghỉ ốm" },
  { value: "UNPAID", label: "Nghỉ không lương" },
  { value: "OTHER", label: "Khác" },
];

// Component EditModal
interface EditModalProps {
  request: LeaveRequest;
  onSubmit: (id: number, data: {
    start_date?: string;
    end_date?: string;
    type?: string;
    detail?: string;
  }) => void;
  onClose: () => void;
}

function EditModal({ request, onSubmit, onClose }: EditModalProps) {
  const [startDate, setStartDate] = useState(request.start_date);
  const [endDate, setEndDate] = useState(request.end_date);
  const [type, setType] = useState(request.type);
  const [detail, setDetail] = useState(request.detail);

  const handleSubmit = () => {
    if (!startDate || !endDate || !detail) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    onSubmit(request.id, {
      start_date: startDate,
      end_date: endDate,
      type,
      detail
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99998]" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-8 z-[99999] animate-fade-in">
        <h3 className="text-xl font-bold mb-6 text-center">Chỉnh sửa đơn nghỉ phép</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Loại đơn</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as RequestType)}
              className="w-full border rounded px-3 py-2"
            >
              {requestTypes.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Ngày bắt đầu</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Ngày kết thúc</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Lý do</label>
            <textarea
              value={detail}
              onChange={e => setDetail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows={3}
              placeholder="Nhập lý do nghỉ phép..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Huỷ</button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LeaveRequestStaff() {
  const { accessToken } = useContext(AppContext)!;

  // Danh sách đơn nghỉ phép
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  // Đơn đang xem chi tiết
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  // Trạng thái loading
  const [loading, setLoading] = useState(false);
  // Trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);
  // Hiển thị modal tạo đơn
  const [showCreateModal, setShowCreateModal] = useState(false);
  // Modal chỉnh sửa đơn
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState<LeaveRequest | null>(null);
  // Số đơn trên mỗi trang
  const itemsPerPage = 10;
  // Tổng số trang
  const [totalPages, setTotalPages] = useState(1);
  // Số ngày đã nghỉ
  const [usedDays, setUsedDays] = useState<{
    total_rest_days_in_30_days: number;
    total_rest_days_in_year: number;
  }>({
    total_rest_days_in_30_days: 0,
    total_rest_days_in_year: 0
  });

  // Hàm chuyển đổi loại nghỉ phép sang tiếng Việt
  const getLeaveTypeText = (type: string) => {
    switch (type) {
      case "ANNUAL":
        return "Nghỉ phép năm";
      case "UNPAID":
        return "Nghỉ không lương";
      case "MATERNITY":
        return "Nghỉ thai sản";
      case "PATERNITY":
        return "Nghỉ chăm sóc con";
      case "SICK":
        return "Nghỉ ốm";
      case "OTHER":
        return "Khác";
      default:
        return type;
    }
  };

  // Hàm render trạng thái đơn
  const renderStatus = (status: string) => {
    switch (status) {
      case "WAITING":
        return <span className="inline-flex px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">Chờ duyệt</span>;
      case "PENDING":
        return <span className="inline-flex px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">Đã gửi</span>;
      case "APPROVED":
        return <span className="inline-flex px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Đã duyệt</span>;
      case "REJECTED":
        return <span className="inline-flex px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Từ chối</span>;
      default:
        return <span className="inline-flex px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  // Hàm lấy số ngày đã nghỉ
  const fetchUsedDays = async () => {
    if (!accessToken) return;
    try {
      console.log("🔄 Đang gọi API getQuantityRestDay...");
      const response = await getQuantityRestDay(accessToken);
      console.log("✅ API getQuantityRestDay thành công:", response);
      setUsedDays({
        total_rest_days_in_30_days: response.data?.total_rest_days_in_30_days || 0,
        total_rest_days_in_year: response.data?.total_rest_days_in_year || 0
      });
    } catch (error: any) {
      console.error("❌ Error fetching used days:", error);
      // Tạm thời set giá trị mặc định để không crash UI
      setUsedDays({
        total_rest_days_in_30_days: 0,
        total_rest_days_in_year: 0
      });
      
      // Hiển thị thông báo lỗi cho user (tùy chọn)
      // alert("Không thể tải thông tin ngày nghỉ. Vui lòng thử lại sau.");
    }
  };

  // Hàm lấy danh sách đơn nghỉ phép từ API
  const fetchLeaveRequests = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      console.log("🔄 Đang gọi API getLeaveRequests...", { page: currentPage, page_size: itemsPerPage });
      const res = await getLeaveRequests(accessToken, { page: currentPage, page_size: itemsPerPage });
      const data = res.data || {};
      console.log("📋 Dữ liệu nhận được từ API:", data);
      
      const mappedRequests = Array.isArray(data.leave_requests)
        ? data.leave_requests.map((req: any) => ({
            id: req.id,
            employee_id: req.employee_id,
            employee_name: req.employee_name,
            manager_id: req.manager_id,
            approver: req.manager_id ? `ID: ${req.manager_id}` : "",
            create_date: req.create_date,
            start_date: req.start_date,
            end_date: req.end_date,
            type: req.type,
            status: req.status, // Giữ nguyên chữ HOA từ API
            detail: req.detail,
            update_date: req.update_date,
          }))
        : [];
        
      console.log("🏷️ Danh sách đơn nghỉ phép sau khi map:", mappedRequests);
      console.log("🔍 Trạng thái của từng đơn:", mappedRequests.map((req: any) => ({ id: req.id, status: req.status })));
      
      setLeaveRequests(mappedRequests);
      setTotalPages(data.total_pages || 1);
    } catch (error: any) {
      console.error("❌ Error fetching leave requests:", error);
      setLeaveRequests([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Tự động gọi API khi accessToken, currentPage, itemsPerPage thay đổi
  useEffect(() => {
    fetchLeaveRequests();
    fetchUsedDays();
    // eslint-disable-next-line
  }, [accessToken, currentPage, itemsPerPage]);

  // Hàm xóa đơn nghỉ phép
  const handleDelete = async (id: number) => {
    if (!accessToken) return;
    if (window.confirm("Bạn có chắc muốn xóa đơn này?")) {
      try {
        await deleteLeaveRequest(accessToken, String(id));
        alert("Xóa đơn thành công!");
        fetchLeaveRequests(); // Reload danh sách
      } catch (err: any) {
        console.error("❌ Delete failed:", err);
        alert("Xóa đơn thất bại: " + (err.message || "Lỗi không xác định"));
      }
    }
  };

  // Hàm mở modal tạo đơn
  const handleCreate = () => {
    setShowCreateModal(true);
  };

  // Hàm tạo đơn nghỉ phép
  const handleSubmitCreate = async (data: {
    start_date: string;
    end_date: string;
    type: string;
    detail: string;
  }) => {
    if (!accessToken) return;
    try {
      const payload = {
        start_date: data.start_date,
        end_date: data.end_date,
        type: data.type as RequestType,
        detail: data.detail,
      };
      await createLeaveRequest(accessToken, payload);
      alert("Tạo đơn thành công!");
      setShowCreateModal(false);
      fetchLeaveRequests(); // Reload danh sách
    } catch (err: any) {
      console.error("❌ Create failed:", err);
      alert("Tạo đơn thất bại: " + (err.message || "Lỗi không xác định"));
    }
  };

  // Hàm gửi đơn nghỉ phép
  const handleSendRequest = async (id: number) => {
    if (!accessToken) return;
    try {
      console.log("🚀 Bắt đầu gửi đơn với ID:", id);
      const result = await sendLeaveRequest(accessToken, id);
      console.log("✅ Gửi đơn thành công, kết quả:", result);
      alert("Gửi đơn thành công!");
      
      // Thêm delay nhỏ để đảm bảo server đã cập nhật
      console.log("⏳ Đợi 1 giây để server cập nhật...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("🔄 Đang reload danh sách đơn nghỉ phép...");
      await fetchLeaveRequests(); // Reload danh sách
      console.log("✅ Đã reload xong danh sách");
    } catch (err: any) {
      console.error("❌ Send failed:", err);
      alert("Gửi đơn thất bại: " + (err.message || "Lỗi không xác định"));
    }
  };

  // Hàm mở modal chỉnh sửa
  const handleEdit = (request: LeaveRequest) => {
    setEditingRequest(request);
    setShowEditModal(true);
  };

  // Hàm cập nhật đơn nghỉ phép
  const handleUpdateRequest = async (id: number, updateData: {
    start_date?: string;
    end_date?: string;
    type?: string;
    detail?: string;
  }) => {
    if (!accessToken) return;
    try {
      const data = {
        id,
        ...updateData,
        type: updateData.type as RequestType,
      };
      await updateLeaveRequest(accessToken, data);
      alert("Cập nhật đơn thành công!");
      setShowEditModal(false);
      setEditingRequest(null);
      fetchLeaveRequests(); // Reload danh sách
    } catch (err: any) {
      console.error("❌ Update failed:", err);
      alert("Cập nhật đơn thất bại: " + (err.message || "Lỗi không xác định"));
    }
  };

  return (
    <div className="p-6 font-sans">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Đơn xin nghỉ phép của bạn</h2>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          + Tạo đơn mới
        </button>
      </div>

      {/* 2 ô thông tin ngày nghỉ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              📅
            </div>
            <div>
              <p className="text-sm text-gray-600">Số ngày đã nghỉ trong 30 ngày</p>
              <p className="text-2xl font-bold text-blue-600">{usedDays.total_rest_days_in_30_days} ngày</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              🗓️
            </div>
            <div>
              <p className="text-sm text-gray-600">Số ngày đã nghỉ trong năm</p>
              <p className="text-2xl font-bold text-green-600">{usedDays.total_rest_days_in_year} ngày</p>
            </div>
          </div>
        </div>
      </div>
      <LeaveRequestCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleSubmitCreate}
      />

      {/* Modal chỉnh sửa đơn */}
      {showEditModal && editingRequest && (
        <EditModal 
          request={editingRequest}
          onSubmit={handleUpdateRequest}
          onClose={() => {
            setShowEditModal(false);
            setEditingRequest(null);
          }}
        />
      )}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg">
              <span className="mr-3 text-blue-600">⏳</span>
              Đang tải dữ liệu...
            </div>
          </div>
        ) : leaveRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
              <span className="text-gray-400 text-2xl">📄</span>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có đơn nghỉ phép</h3>
            <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách tạo đơn nghỉ phép mới.</p>
            <div className="mt-6">
              <button
                onClick={handleCreate}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="mr-2">➕</span>
                Tạo đơn mới
              </button>
            </div>
          </div>
        ) : (
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-center">STT</th>
                <th className="border px-4 py-2 text-center">Ngày tạo</th>
                <th className="border px-4 py-2 text-center">Loại</th>
                <th className="border px-4 py-2 text-center">Trạng thái</th>
                <th className="border px-4 py-2 text-center">Chi tiết</th>
                <th className="border px-4 py-2 text-center">Người kiểm duyệt</th>
                <th className="border px-4 py-2 text-center">Thao tác</th>
                <th className="border px-4 py-2 text-center">Gửi</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((req, index) => (
                <tr key={req.id} className="border hover:bg-gray-50">
                  <td className="border px-4 py-2 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="border px-4 py-2 text-center">{req.create_date}</td>
                  <td className="border px-4 py-2 text-center">{getLeaveTypeText(req.type)}</td>
                  <td className="border px-4 py-2 text-center">
                    {renderStatus(req.status)}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => setSelectedRequest(req)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                  <td className="border px-4 py-2 text-center">{req.status === "WAITING" ? "" : req.approver}</td>
                  <td className="border px-4 py-2 text-center">
                    <div className="flex gap-2 justify-center">
                      {req.status === "WAITING" && (
                        <>
                          <button
                            className="inline-flex items-center p-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200 group"
                            onClick={() => handleEdit(req)}
                            title="Chỉnh sửa đơn"
                          > 
                            <span className="text-lg">✏️</span>
                          </button>
                          <button
                            className="inline-flex items-center p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200 group"
                            onClick={() => handleDelete(req.id)}
                            title="Xóa đơn"
                          >
                            <span className="text-lg">🗑️</span>
                          </button>
                        </>
                      )}
                      {req.status !== "WAITING" && (
                        <span className="text-gray-400 text-sm italic">Không có thao tác</span>
                      )}
                    </div>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {req.status === "WAITING" && (
                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition-colors duration-200 font-medium"
                        onClick={() => handleSendRequest(req.id)}
                        title="Gửi đơn để xét duyệt"
                      >
                        Gửi đơn
                      </button>
                    )}
                    {req.status === "PENDING" && (
                      <span className="text-yellow-600 text-sm italic">Đã gửi</span>
                    )}
                    {(req.status === "APPROVED" || req.status === "REJECTED") && (
                      <span className="text-gray-400 text-sm italic">Đã xử lý</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && leaveRequests.length > 0 && (
          <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Trước
          </button>
          <span className="self-center">Trang {currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Sau
          </button>
          </div>
        )}
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99998]"
            onClick={() => setSelectedRequest(null)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-xl p-8 z-[99999] animate-fade-in">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Chi tiết đơn xin nghỉ</h3>
            <div className="space-y-4 text-gray-700">
              <div><span className="font-semibold">📅 Xin nghỉ từ:</span> {selectedRequest.start_date} đến {selectedRequest.end_date}</div>
              <div><span className="font-semibold">📂 Loại nghỉ:</span> {getLeaveTypeText(selectedRequest.type)}</div>
              <div><span className="font-semibold">📝 Lý do:</span> {selectedRequest.detail}</div>
              <div><span className="font-semibold">📌 Trạng thái:</span> {renderStatus(selectedRequest.status)}</div>
              <div><span className="font-semibold">✔️ Người duyệt:</span> {selectedRequest.status === "WAITING" ? "--" : selectedRequest.approver}</div>
            </div>
            <div className="text-center mt-6">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}