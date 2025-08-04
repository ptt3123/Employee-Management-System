import React from "react";
import { CheckIcon, Loader2 } from "lucide-react";

interface Props {
  checkInTime: string | null;
  checkOutTime: string | null;
  onCheckIn: () => void;
  onCheckOut: () => void;
  workingStatus: string;
  loading?: boolean; // Add loading prop
}

function formatDateTime(iso: string | null) {
  if (!iso) return "--:--";
  const date = new Date(iso);
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  const mo = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${h}:${m} - ${d}/${mo}/${y}`;
}

const CheckInOut: React.FC<Props> = ({
  checkInTime,
  checkOutTime,
  onCheckIn,
  onCheckOut,
  workingStatus,
  loading = false,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
    {/* Check-in */}
    <div className="p-4 border rounded bg-white shadow flex flex-col h-full">
      <div className="font-medium mb-2 text-base font-semibold text-gray-700 mb-1">Check-in</div>
      <div className="text-sm mb-1">
        Thời gian:{" "}
        <span className="font-semibold">{formatDateTime(checkInTime)}</span>
      </div>
      {checkInTime ? (
        <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
          <CheckIcon size={16} /> Đã check-in
        </div>
      ) : (
        <button
          onClick={onCheckIn}
          disabled={loading}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Đang xử lý...
            </>
          ) : (
            'Check-in'
          )}
        </button>
      )}
    </div>

    {/* Check-out */}
    <div className="p-4 border rounded bg-white shadow flex flex-col h-full">
      <div className="font-medium mb-2 text-base font-semibold text-gray-700 mb-1">Check-out</div>
      <div className="text-sm mb-1">
        Thời gian:{" "}
        <span className="font-semibold">{formatDateTime(checkOutTime)}</span>
      </div>
      {checkOutTime ? (
        <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
          <CheckIcon size={16} /> Đã check-out
        </div>
      ) : (
        <button
          onClick={onCheckOut}
          disabled={loading}
          className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Đang xử lý...
            </>
          ) : (
            'Check-out'
          )}
        </button>
      )}
    </div>

    {/* Trạng thái */}
    <div className="p-4 border rounded bg-white shadow flex flex-col h-full">
      <div className="font-medium mb-2 text-base font-semibold text-gray-700 mb-1">Trạng thái</div>
      <div className="text-sm mt-1">{workingStatus}</div>
    </div>
  </div>
);

export default CheckInOut;
