import React from "react";
import { Modal } from "../ui/modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  shiftDate: string;
  shiftType: "morning" | "afternoon";
  setShiftDate: (date: string) => void;
  setShiftType: (type: "morning" | "afternoon") => void;
  onSubmit: () => void;
  selectedEvent: any;
}

const ShiftModal: React.FC<Props> = ({
  isOpen,
  onClose,
  shiftDate,
  shiftType,
  setShiftDate,
  setShiftType,
  onSubmit,
  selectedEvent,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} className="max-w-[450px] p-6">
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        {selectedEvent ? "Chỉnh sửa ca làm" : "Đăng ký ca làm"}
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
        <label>Chọn ca</label>
        <div className="flex flex-col gap-2">
          <label>
            <input
              type="radio"
              name="shift"
              value="morning"
              checked={shiftType === "morning"}
              onChange={() => setShiftType("morning")}
            />{" "}
            Ca sáng (08:00 - 12:00)
          </label>
          <label>
            <input
              type="radio"
              name="shift"
              value="afternoon"
              checked={shiftType === "afternoon"}
              onChange={() => setShiftType("afternoon")}
            />{" "}
            Ca chiều (13:30 - 17:30)
          </label>
        </div>
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