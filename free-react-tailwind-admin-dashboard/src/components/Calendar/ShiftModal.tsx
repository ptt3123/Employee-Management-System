import React from "react";
import { Modal } from "../ui/modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  shiftDate: string;
  shiftStart: string; // ISO time string, e.g. "08:00"
  shiftEnd: string;   // ISO time string, e.g. "17:00"
  setShiftDate: (date: string) => void;
  setShiftStart: (time: string) => void;
  setShiftEnd: (time: string) => void;
  onSubmit: () => void;
  selectedEvent: any;
  isRegistered?: boolean; // truyền từ parent để biết đã đăng ký chưa
}

const ShiftModal: React.FC<Props> = ({
  isOpen,
  onClose,
  shiftDate,
  shiftStart,
  shiftEnd,
  setShiftDate,
  setShiftStart,
  setShiftEnd,
  onSubmit,
  selectedEvent,
  isRegistered,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} className="max-w-[450px] p-6">
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        {selectedEvent ? "Chỉnh sửa ca làm" : "Đăng ký ca làm"}
        {isRegistered && (
          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold ml-2">
            <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Đã đăng ký
          </span>
        )}
      </h3>
      <div className="flex flex-col space-y-2">
        <label>Ngày làm việc</label>
        <input
          type="date"
          value={shiftDate}
          onChange={(e) => setShiftDate(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label>Thời gian bắt đầu</label>
        <input
          type="time"
          value={shiftStart}
          onChange={(e) => setShiftStart(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label>Thời gian kết thúc</label>
        <input
          type="time"
          value={shiftEnd}
          onChange={(e) => setShiftEnd(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
          Huỷ
        </button>
        <button
          onClick={onSubmit}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          {selectedEvent ? "Lưu" : "Đăng ký"}
        </button>
      </div>
    </div>
  </Modal>
);

export default ShiftModal;