// ✅ Đã chỉnh sửa: popup đẹp hơn + dropdown chọn trạng thái + màu sắc + phân trang + font tiếng Việt + dữ liệu giả nhiều hơn
import { useEffect, useState, useContext } from "react";
import { getAdminLeaveRequests, processLeaveRequest } from "../../api/leaveRequestApi";
import { AppContext } from "../../context/AppContext";
import { RequestStatus, LeaveRequest as LeaveRequestType } from "../../types/leave";

// Sử dụng interface LeaveRequest từ leave.ts
type LeaveRequest = LeaveRequestType & {
  employeeName: string;
};

export default function LeaveRequestManager() {
  const { accessToken } = useContext(AppContext)!;
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách đơn nghỉ phép cho admin
  const fetchLeaveRequests = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await getAdminLeaveRequests(accessToken, { page: currentPage, page_size: itemsPerPage });
      const data = res.data || {};
      setLeaveRequests(
        Array.isArray(data.leave_requests)
          ? data.leave_requests.map((req: any) => ({
              ...req,
              employeeName: req.employee_name || `ID: ${req.employee_id}`,
              status: req.status.toUpperCase() as RequestStatus,
              approver: req.manager_id ? `ID: ${req.manager_id}` : "--", // Thêm dòng này
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

  useEffect(() => {
    fetchLeaveRequests();
    // eslint-disable-next-line
  }, [accessToken, currentPage, itemsPerPage]);

  // Admin xử lý trạng thái đơn nghỉ phép
  const handleProcessStatus = async (id: number, newStatus: RequestStatus) => {
    if (!accessToken) return;
    try {
      await processLeaveRequest(accessToken, { id, status: newStatus });
      fetchLeaveRequests();
    } catch (err: any) {
      alert("Xử lý đơn thất bại: " + err.message);
    }
  };

  const renderStatus = (status: RequestStatus) => {
    switch (status) {
      case "PENDING":
        return <span className="text-yellow-600 font-semibold">Chờ xác nhận</span>;
      case "APPROVED":
        return <span className="text-green-600 font-semibold">Đã xác nhận</span>;
      case "REJECTED":
        return <span className="text-red-600 font-semibold">Từ chối</span>;
      case "WAITING":
        return <span className="text-blue-600 font-semibold">Đang chờ</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const paginatedData = leaveRequests; // backend đã phân trang

  return (
    <div className="p-6 font-sans">
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">Đang tải dữ liệu...</div>
        ) : (
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-center">STT</th>
                <th className="border px-4 py-2 text-center">Họ và tên</th>
                <th className="border px-4 py-2 text-center">Ngày tạo</th>
                <th className="border px-4 py-2 text-center">Loại</th>
                <th className="border px-4 py-2 text-center">Trạng thái</th>
                <th className="border px-4 py-2 text-center">Chi tiết</th>
                <th className="border px-4 py-2 text-center">Người kiểm duyệt</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((req, index) => (
                <tr key={req.id} className="border">
                  <td className="border px-4 py-2 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="border px-4 py-2 text-center">{req.employeeName}</td>
                  <td className="border px-4 py-2 text-center">{req.create_date}</td>
                  <td className="border px-4 py-2 text-center">{req.type}</td>
                  <td className="border px-4 py-2 text-center">
                    <select
                      value={req.status}
                      onChange={(e) => handleProcessStatus(req.id, e.target.value as RequestStatus)}
                      className={
                        "border rounded px-2 py-1 " +
                        (req.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : req.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700")
                      }
                    >
                      <option value="PENDING">Chờ xác nhận</option>
                      <option value="APPROVED">Đã xác nhận</option>
                      <option value="REJECTED">Từ chối</option>
                      <option value="WAITING">Đang chờ</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => setSelectedRequest(req)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {req.status === "PENDING" ? "--" : req.manager_id ? `ID: ${req.manager_id}` : "--"}
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
              <div><span className="font-semibold">👤 Họ và tên:</span> {selectedRequest.employeeName}</div>
              <div><span className="font-semibold">📅 Xin nghỉ từ:</span> {selectedRequest.start_date} đến {selectedRequest.end_date}</div>
              <div><span className="font-semibold">📂 Loại nghỉ:</span> {selectedRequest.type}</div>
              <div><span className="font-semibold">📝 Lý do:</span> {selectedRequest.detail}</div>
              <div><span className="font-semibold">📌 Trạng thái:</span> {renderStatus(selectedRequest.status)}</div>
              <div><span className="font-semibold">✔️ Người duyệt:</span> {selectedRequest.status === "PENDING" ? "--" : selectedRequest.approver}</div>
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
