import  { useState } from "react";
import { LeaveRequestCreate, RequestType } from "../../types/leave";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeaveRequestCreate) => void;
}

const requestTypes = [
  { value: "ANNUAL", label: "Nghỉ phép năm" },
  { value: "MATERNITY", label: "Nghỉ thai sản" },
  { value: "PATERNITY", label: "Nghỉ chăm sóc con" },
  { value: "PAID", label: "Nghỉ có lương" },
  { value: "UNPAID", label: "Nghỉ không lương" },
  { value: "OTHER", label: "Khác" },
];

export default function LeaveRequestCreateModal({ isOpen, onClose, onSubmit }: Props) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState(requestTypes[0].value);
  const [detail, setDetail] = useState("");

  const handleSubmit = () => {
    if (!startDate || !endDate || !detail) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    const payload = { 
      start_date: startDate, 
      end_date: endDate, 
      type: type as RequestType, 
      detail 
    };
    console.log("Payload gửi lên backend:", payload); // Thêm dòng này
    onSubmit(payload);
    setStartDate("");
    setEndDate("");
    setType(requestTypes[0].value);
    setDetail("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99998]" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-8 z-[99999] animate-fade-in">
        <h3 className="text-xl font-bold mb-6 text-center">Tạo đơn nghỉ phép</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Loại đơn</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
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
            Tạo đơn
          </button>
        </div>
      </div>
    </div>
  );
}