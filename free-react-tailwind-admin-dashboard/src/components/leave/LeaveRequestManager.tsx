// ✅ Đã chỉnh sửa: popup đẹp hơn + dropdown chọn trạng thái + màu sắc + phân trang + font tiếng Việt + dữ liệu giả nhiều hơn
import  { useState } from "react";

interface LeaveRequest {
  id: number;
  employeeName: string;
  createDate: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  detail: string;
  approver?: string;
  startDate: string;
  endDate: string;
}

export default function LeaveRequestManager() {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([...Array(20)].map((_, i) => {
    const statusOptions: LeaveRequest["status"][] = ["pending", "approved", "rejected"];
    const typeOptions = ["Nghỉ phép", "Nghỉ việc riêng", "Nghỉ thai sản"];
    const approvers = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Đỗ Thị D"];
    const status = statusOptions[i % 3];
    return {
      id: i + 1,
      employeeName: `Nhân viên ${String.fromCharCode(65 + i)}`,
      createDate: `2025-07-${(10 + i).toString().padStart(2, '0')}`,
      type: typeOptions[i % 3],
      status,
      detail: `Lý do nghỉ số ${i + 1}`,
      approver: status !== "pending" ? approvers[i % approvers.length] : undefined,
      startDate: `2025-08-${(1 + i).toString().padStart(2, '0')}`,
      endDate: `2025-08-${(2 + i).toString().padStart(2, '0')}`,
    };
  }));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const renderStatus = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="text-yellow-600 font-semibold">Chờ xác nhận</span>;
      case "approved":
        return <span className="text-green-600 font-semibold">Đã xác nhận</span>;
      case "rejected":
        return <span className="text-red-600 font-semibold">Từ chối</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const updateStatus = (id: number, newStatus: LeaveRequest["status"]) => {
    setLeaveRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: newStatus } : req
      )
    );
  };

  const paginatedData = leaveRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(leaveRequests.length / itemsPerPage);

  return (
    <div className="p-6 font-sans">
      
      <div className="overflow-x-auto">
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
                <td className="border px-4 py-2 text-center">{req.createDate}</td>
                <td className="border px-4 py-2 text-center">{req.type}</td>
                <td className="border px-4 py-2 text-center">
                  <select
                    value={req.status}
                    onChange={(e) => updateStatus(req.id, e.target.value as LeaveRequest["status"])}
                    className={
                      "border rounded px-2 py-1 " +
                      (req.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : req.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700")
                    }
                  >
                    <option value="pending">Chờ xác nhận</option>
                    <option value="approved">Đã xác nhận</option>
                    <option value="rejected">Từ chối</option>
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
                <td className="border px-4 py-2 text-center">{req.status === "pending" ? "" : req.approver}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
