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
import { RequestType } from "../../types/leave";

interface LeaveRequest {
  id: number;
  createDate: string;
  type: string;
  status: "pending" | "approved" | "rejected" | "draft";
  detail: string;
  approver?: string;
  startDate: string;
  endDate: string;
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
  // Số đơn trên mỗi trang
  const itemsPerPage = 10;
  // Tổng số trang
  const [totalPages, setTotalPages] = useState(1);

  // Hàm lấy danh sách đơn nghỉ phép từ API
  const fetchLeaveRequests = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await getLeaveRequests(accessToken, { page: currentPage, page_size: itemsPerPage });
      const data = res.data || {};
      setLeaveRequests(
        Array.isArray(data.leave_requests)
          ? data.leave_requests.map((req: any) => ({
              id: req.id,
              createDate: req.create_date,
              startDate: req.start_date,
              endDate: req.end_date,
              type: req.type,
              status: req.status.toLowerCase(),
              detail: req.detail,
              approver: req.manager_id ? `ID: ${req.manager_id}` : "",
            }))
          : []
      );
      setTotalPages(data.total_pages || 1);
    } catch {
      setLeaveRequests([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Tự động gọi API khi accessToken, currentPage, itemsPerPage thay đổi
  useEffect(() => {
    fetchLeaveRequests();
    // eslint-disable-next-line
  }, [accessToken, currentPage, itemsPerPage]);

  // Hàm reload lại danh sách sau khi thêm/xóa/gửi đơn
  const reloadLeaveRequests = () => {
    fetchLeaveRequests();
  };

  // Hàm xóa đơn nghỉ phép
  const handleDelete = async (id: number) => {
    if (!accessToken) return;
    if (window.confirm("Bạn có chắc muốn xóa đơn này?")) {
      try {
        await deleteLeaveRequest(accessToken, String(id));
        setLoading(true);
        reloadLeaveRequests();
      } catch (err: any) {
        alert("Xóa đơn thất bại: " + err.message);
      }
    }
  };

  // Hàm mở modal tạo đơn
  const handleCreate = () => {
    setShowCreateModal(true);
  };

  // Hàm format ngày (không cần chuyển đổi)
  const formatDate = (dateStr: string) => dateStr;

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
        ...data,
        start_date: formatDate(data.start_date),
        end_date: formatDate(data.end_date),
        type: data.type as RequestType,
      };
      await createLeaveRequest(accessToken, payload);
      setLoading(true);
      reloadLeaveRequests();
    } catch (err: any) {
      alert("Tạo đơn thất bại: " + err.message);
    }
  };

  // Hàm gửi đơn nghỉ phép
  const handleSendRequest = async (id: number) => {
    if (!accessToken) return;
    try {
      await sendLeaveRequest(accessToken, { id });
      setLoading(true);
      reloadLeaveRequests();
      alert("Gửi đơn thành công!");
    } catch (err: any) {
      alert("Gửi đơn thất bại: " + err.message);
    }
  };

  // Hàm render trạng thái đơn
  const renderStatus = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="text-yellow-600 font-semibold">Chờ xác nhận</span>;
      case "approved":
        return <span className="text-green-600 font-semibold">Đã xác nhận</span>;
      case "rejected":
        return <span className="text-red-600 font-semibold">Từ chối</span>;
      case "draft":
        return <span className="text-gray-500 font-semibold">Chưa gửi</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="p-6 font-sans">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Đơn xin nghỉ phép của bạn</h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          + Tạo đơn mới
        </button>
      </div>
      <LeaveRequestCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleSubmitCreate}
      />
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">Đang tải dữ liệu...</div>
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
                <th className="border px-4 py-2 text-center">Xóa</th>
                <th className="border px-4 py-2 text-center">Gửi đơn</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((req, index) => (
                <tr key={req.id} className="border">
                  <td className="border px-4 py-2 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="border px-4 py-2 text-center">{req.createDate}</td>
                  <td className="border px-4 py-2 text-center">{req.type}</td>
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
                  <td className="border px-4 py-2 text-center">{req.status === "pending" ? "" : req.approver}</td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(req.id)}
                    >
                      Xóa
                    </button>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {req.status === "draft" && (
                      <button
                        className="px-2 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                        onClick={() => handleSendRequest(req.id)}
                      >
                        Gửi đơn
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
              <div><span className="font-semibold">📅 Xin nghỉ từ:</span> {selectedRequest.startDate} đến {selectedRequest.endDate}</div>
              <div><span className="font-semibold">📂 Loại nghỉ:</span> {selectedRequest.type}</div>
              <div><span className="font-semibold">📝 Lý do:</span> {selectedRequest.detail}</div>
              <div><span className="font-semibold">📌 Trạng thái:</span> {renderStatus(selectedRequest.status)}</div>
              <div><span className="font-semibold">✔️ Người duyệt:</span> {selectedRequest.status === "pending" ? "--" : selectedRequest.approver}</div>
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