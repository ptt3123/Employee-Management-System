import React, { useState } from "react";

const salaryList = [
  {
    id: 1,
    employee: "Nguyễn Văn A",
    basicSalary: 8000000,
    allowance: 1000000,
    bonus: 500000,
    status: "Đã trả",
    payslipUrl: "/payslip/1.pdf",
  },
  {
    id: 2,
    employee: "Trần Thị B",
    basicSalary: 7500000,
    allowance: 800000,
    bonus: 400000,
    status: "Chưa trả",
    payslipUrl: "/payslip/2.pdf",
  },
  // ...thêm dữ liệu nếu muốn
];

const statusOptions = ["Đã trả", "Chưa trả"];

export default function SalaryManagement() {
  const [data, setData] = useState(salaryList);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleStatusChange = (id: number, value: string) => {
    const updated = data.map((item) =>
      item.id === id ? { ...item, status: value } : item
    );
    setData(updated);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const renderStatus = (status: string) => {
    switch (status) {
      case "Đã trả":
        return <span className="text-green-600 font-semibold">Đã trả</span>;
      case "Chưa trả":
        return <span className="text-yellow-600 font-semibold">Chưa trả</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="p-6 font-sans">
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center">STT</th>
              <th className="border px-4 py-2 text-center">Nhân viên</th>
              <th className="border px-4 py-2 text-center">Lương cơ bản</th>
              <th className="border px-4 py-2 text-center">Phụ cấp</th>
              <th className="border px-4 py-2 text-center">Thưởng</th>
              <th className="border px-4 py-2 text-center">Tổng thu nhập</th>
              <th className="border px-4 py-2 text-center">Trạng thái</th>
              <th className="border px-4 py-2 text-center">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => {
              const total =
                row.basicSalary + row.allowance + row.bonus;

              return (
                <tr key={row.id} className="border">
                  <td className="border px-4 py-2 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="border px-4 py-2 text-center">{row.employee}</td>
                  <td className="border px-4 py-2 text-center">{row.basicSalary.toLocaleString()}₫</td>
                  <td className="border px-4 py-2 text-center">{row.allowance.toLocaleString()}₫</td>
                  <td className="border px-4 py-2 text-center">{row.bonus.toLocaleString()}₫</td>
                  <td className="border px-4 py-2 text-center font-semibold text-blue-700">
                    {total.toLocaleString()}₫
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <select
                      className={
                        "border rounded px-2 py-1 " +
                        (row.status === "Đã trả"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700")
                      }
                      value={row.status}
                      onChange={(e) => handleStatusChange(row.id, e.target.value)}
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() =>
                        setDetailId(detailId === row.id ? null : row.id)
                      }
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              );
            })}

            {/* Chi tiết phiếu lương popup */}
            {detailId &&
              (() => {
                const item = data.find((d) => d.id === detailId);
                if (!item) return null;
                return (
                  <tr>
                    <td colSpan={8}>
                      <div className="fixed inset-0 z-[99999] flex items-center justify-center">
                        <div
                          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99998]"
                          onClick={() => setDetailId(null)}
                        ></div>
                        <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-xl p-8 z-[99999] animate-fade-in">
                          <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Chi tiết phiếu lương</h3>
                          <div className="space-y-4 text-gray-700">
                            <div><span className="font-semibold">👤 Nhân viên:</span> {item.employee}</div>
                            <div><span className="font-semibold">💵 Lương cơ bản:</span> {item.basicSalary.toLocaleString()}₫</div>
                            <div><span className="font-semibold">➕ Phụ cấp:</span> {item.allowance.toLocaleString()}₫</div>
                            <div><span className="font-semibold">🎁 Thưởng:</span> {item.bonus.toLocaleString()}₫</div>
                            <div><span className="font-semibold">💰 Tổng thu nhập:</span> <span className="text-blue-700 font-bold">{(item.basicSalary + item.allowance + item.bonus).toLocaleString()}₫</span></div>
                            <div><span className="font-semibold">📌 Trạng thái:</span> {renderStatus(item.status)}</div>
                          </div>
                          <div className="text-center mt-6 flex justify-center gap-3">
                            <a
                              href={item.payslipUrl}
                              target="_blank"
                              className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 text-sm"
                            >
                              Xuất phiếu
                            </a>
                            <button
                              onClick={() => setDetailId(null)}
                              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
                            >
                              Đóng
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })()}
          </tbody>
        </table>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Trước
          </button>
          <span className="self-center">Trang {currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}
