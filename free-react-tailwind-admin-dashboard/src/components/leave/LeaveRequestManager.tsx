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
  
  // Filter states - chỉ 4 fields theo API docs
  const [filters, setFilters] = useState({
    type: "",
    leave_request_status: "",
    sort_by: "",
    sort_value: "DESC" as "ASC" | "DESC",
  });

  // Lấy danh sách đơn nghỉ phép cho admin
  const fetchLeaveRequests = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      console.log("🔄 Admin đang gọi API getAdminLeaveRequests...");
      
      // Chỉ sử dụng 4 parameters được hỗ trợ
      const apiParams: any = { 
        page: currentPage, 
        page_size: itemsPerPage 
      };
      
      // Chỉ thêm filter nếu có giá trị
      if (filters.type) apiParams.type = filters.type;
      if (filters.leave_request_status) apiParams.leave_request_status = filters.leave_request_status;
      if (filters.sort_by) apiParams.sort_by = filters.sort_by;
      if (filters.sort_value) apiParams.sort_value = filters.sort_value;
      
      console.log("📤 Sending params to API:", apiParams);
      
      const res = await getAdminLeaveRequests(accessToken, apiParams);
      
      console.log("📋 Dữ liệu admin nhận được từ API:", res);
      
      // API trả về structure: { success: true, data: { leave_requests: [...] } }
      const data = res.data || {};
      
      const mappedRequests = Array.isArray(data.leave_requests)
        ? data.leave_requests.map((req: any) => ({
            id: req.id,
            employee_id: req.employee_id,
            // employee_name: req.employee_name || `Nhân viên #${req.employee_id}`,
            // employeeName: req.employee_name || `Nhân viên #${req.employee_id}`,
            manager_id: req.manager_id, // Có thể null
            approver: req.manager_id ? `Manager #${req.manager_id}` : "--",
            create_date: req.create_date,
            start_date: req.start_date,
            end_date: req.end_date,
            type: req.type,
            status: req.status as RequestStatus,
            detail: req.detail,
            update_date: req.update_date,
          }))
        : [];
        
      console.log("🏷️ Danh sách đơn nghỉ phép admin sau khi map:", mappedRequests);
      console.log("🔍 Trạng thái của từng đơn (admin):", mappedRequests.map((req: any) => ({ id: req.id, status: req.status })));
      
      setLeaveRequests(mappedRequests);
      setTotalPages(data.total_pages || 1);
    } catch (error: any) {
      console.error("❌ Error fetching admin leave requests:", error);
      setLeaveRequests([]);
      setTotalPages(1);
      
      // Hiển thị thông báo lỗi cho admin
      alert("Không thể tải danh sách đơn nghỉ phép: " + (error.message || "Lỗi không xác định"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
    // eslint-disable-next-line
  }, [accessToken, currentPage, itemsPerPage, filters]);

  // Reset về trang 1 khi filter thay đổi
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  

  // Admin xử lý trạng thái đơn nghỉ phép
  const handleProcessStatus = async (id: number, newStatus: RequestStatus) => {
    if (!accessToken) return;
    try {
      console.log("🚀 Admin đang xử lý đơn với ID:", id, "-> trạng thái mới:", newStatus);
      const result = await processLeaveRequest(accessToken, { id, status: newStatus });
      console.log("✅ Admin xử lý đơn thành công, kết quả:", result);
      
      console.log("🔄 Đang reload danh sách đơn nghỉ phép...");
      await fetchLeaveRequests();
      console.log("✅ Đã reload xong danh sách");
      
      alert(`Đã ${newStatus === 'APPROVED' ? 'phê duyệt' : newStatus === 'REJECTED' ? 'từ chối' : 'cập nhật'} đơn thành công!`);
    } catch (err: any) {
      console.error("❌ Admin process failed:", err);
      alert("Xử lý đơn thất bại: " + (err.message || "Lỗi không xác định"));
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

  const paginatedData = leaveRequests; // backend đã phân trang

  return (
    <div className="p-6 font-sans">
      {/* Filter Form - Chỉ 4 fields được API hỗ trợ */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4"></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Loại nghỉ phép</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="">Tất cả</option>
              <option value="ANNUAL">Nghỉ phép năm</option>
              <option value="SICK">Nghỉ ốm</option>
              <option value="MATERNITY">Nghỉ thai sản</option>
              <option value="PATERNITY">Nghỉ chăm sóc con</option>
              <option value="UNPAID">Nghỉ không lương</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select
              value={filters.leave_request_status}
              onChange={(e) => handleFilterChange('leave_request_status', e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="">Tất cả</option>
              <option value="WAITING">Đang chờ</option>
              <option value="PENDING">Chờ xác nhận</option>
              <option value="APPROVED">Đã xác nhận</option>
              <option value="REJECTED">Từ chối</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sắp xếp theo</label>
            <select
              value={filters.sort_by}
              onChange={(e) => handleFilterChange('sort_by', e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="">Mặc định</option>
              <option value="create_date">Ngày tạo</option>
              <option value="start_date">Ngày bắt đầu</option>
              <option value="status">Trạng thái</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thứ tự</label>
            <select
              value={filters.sort_value}
              onChange={(e) => handleFilterChange('sort_value', e.target.value as "ASC" | "DESC")}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="DESC">Giảm dần</option>
              <option value="ASC">Tăng dần</option>
            </select>
          </div>
        </div>
        
      </div>

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
                  <td className="border px-4 py-2 text-center">{getLeaveTypeText(req.type)}</td>
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
                    {req.status === "WAITING" 
                      ? "--" 
                      : req.manager_id 
                        ? `Manager #${req.manager_id}` 
                        : "Chưa phân công"}
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
              <div><span className="font-semibold">📂 Loại nghỉ:</span> {getLeaveTypeText(selectedRequest.type)}</div>
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
