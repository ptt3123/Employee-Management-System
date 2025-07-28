// ✅ Đã cập nhật giao diện: bỏ nút check-in trong từng ô lịch, thêm hai ô check-in / check-out phía trên để theo dõi trạng thái làm việc trong ngày
import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import { CalendarIcon, ClockIcon, AlertTriangleIcon, CalendarOffIcon } from "lucide-react";

interface CalendarEvent extends EventInput {
  extendedProps: {
    shift: string;
    shiftType: "morning" | "afternoon";
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [shiftType, setShiftType] = useState<"morning" | "afternoon">("morning");
  const [shiftDate, setShiftDate] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  
  const shiftMap: Record<string, string> = {
    morning: "Ca sáng",
    afternoon: "Ca chiều",
  };

  const shiftTime: Record<string, string> = {
    morning: "08:00 - 12:00",
    afternoon: "13:30 - 17:30",
  };

  const handleCheckIn = () => {
    const now = new Date().toISOString();
    setCheckInTime(now);
  };

  const handleCheckOut = () => {
    const now = new Date().toISOString();
    setCheckOutTime(now);
  };

  const calculateWorkingStatus = () => {
    if (!checkInTime || !checkOutTime) return "Chưa đủ thông tin";
    const diffMs = new Date(checkOutTime).getTime() - new Date(checkInTime).getTime();
    const workedMinutes = Math.floor(diffMs / (1000 * 60));
    return workedMinutes >= 510 ? "✅ Đủ 1 ngày công" : "⚠️ Chưa đủ giờ";
  };

  useEffect(() => {
    // Lấy dữ liệu từ localStorage khi load trang
    const savedEvents = localStorage.getItem("calendar_events");
    if (savedEvents) {
      try {
        const parsed = JSON.parse(savedEvents);
        // Đảm bảo các trường ngày là string
        const fixedEvents = parsed.map((e: any) => ({
          ...e,
          start: typeof e.start === "string" ? e.start : String(e.start),
          end: typeof e.end === "string" ? e.end : String(e.end),
          extendedProps: { ...e.extendedProps }
        }));
        setEvents(fixedEvents);
      } catch {
        setEvents([]);
      }
    }
  }, []);

  // Thêm useEffect để lưu mỗi khi events thay đổi
  useEffect(() => {
    localStorage.setItem("calendar_events", JSON.stringify(events));
  }, [events]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setShiftDate(selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const clickedEvent = clickInfo.event;
    const clickedShift = clickedEvent.extendedProps.shift;

    const confirmDelete = confirm(`Bạn có muốn huỷ ${clickedShift} vào ngày này không?`);
    if (confirmDelete) {
      setEvents((prev) => prev.filter((e) => e.id !== clickedEvent.id));
    }
  };

  const handleAddOrUpdateEvent = () => {
    const shiftLabel = shiftMap[shiftType];
    const isDuplicate = events.some(
      (e) => e.start === shiftDate && e.extendedProps.shift === shiftLabel
    );

    if (isDuplicate) {
      alert("Ca làm này đã được đăng ký trong ngày.");
      return;
    }

    const newEvent: CalendarEvent = {
      id: `${shiftDate}-${shiftType}`,
      title: `${shiftLabel} \n ${shiftTime[shiftType]}`,
      start: shiftDate,
      end: shiftDate,
      allDay: true,
      extendedProps: {
        shift: shiftLabel,
        shiftType: shiftType,
      },
    };

    const grouped: Record<string, CalendarEvent[]> = {};
    [...events.filter(e => e.id !== newEvent.id), newEvent].forEach(ev => {
      const day = ev.start as string;
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(ev);
    });

    const sortedEvents: CalendarEvent[] = [];
    Object.keys(grouped).sort().forEach(day => {
      grouped[day]
        .sort((a, b) => {
          if (a.extendedProps.shiftType === b.extendedProps.shiftType) return 0;
          if (a.extendedProps.shiftType === "morning") return -1;
          if (b.extendedProps.shiftType === "morning") return 1;
          return 0;
        })
        .forEach(ev => sortedEvents.push(ev));
    });

    setEvents(sortedEvents);
    closeModal();
    resetModalFields();
  };

  const resetModalFields = () => {
    setShiftDate("");
    setShiftType("morning");
    setSelectedEvent(null);
  };

  const formatTime = (iso: string | null) => {
    if (!iso) return "--:--";
    const d = new Date(iso);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <>
      <PageMeta title="Đăng ký lịch làm" description="Chọn ca sáng hoặc chiều trong lịch" />

      {/* DASHBOARD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <SummaryCard icon={<CalendarIcon className="text-green-500" />} label="Tổng công hưởng lương" value="27,5" />
        <SummaryCard icon={<ClockIcon className="text-blue-500" />} label="Tổng giờ làm thêm" value="20,0" />
        <SummaryCard icon={<AlertTriangleIcon className="text-orange-500" />} label="Tổng số lần đi muộn, về sớm" value="2" />
        <SummaryCard icon={<CalendarOffIcon className="text-red-500" />} label="Tổng số ngày nghỉ" value="1,0" />
      </div>

      {/* ✅ VÙNG HIỂN THỊ CHECKIN / CHECKOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 border rounded bg-white shadow flex flex-col h-full">
          <div className="font-medium mb-2">Check-in</div>
          <div className="text-sm mb-1">Thời gian: {formatTime(checkInTime)}</div>
          <button onClick={handleCheckIn} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">Check-in</button>
        </div>
        <div className="p-4 border rounded bg-white shadow flex flex-col h-full">
          <div className="font-medium mb-2">Check-out</div>
          <div className="text-sm mb-1">Thời gian: {formatTime(checkOutTime)}</div>
          <button onClick={handleCheckOut} className="px-3 py-1 bg-gray-700 text-white rounded text-sm">Check-out</button>
        </div>
        <div className="p-4 border rounded bg-white shadow flex flex-col h-full">
          <div className="font-medium mb-2">Trạng thái</div>
          <div className="text-sm mt-1">{calculateWorkingStatus()} </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek",
          }}
          events={events}
          selectable
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={(eventInfo) => renderEventContent(eventInfo)}
          dayMaxEvents={true}
          height="auto"
          contentHeight="auto"
          dayCellContent={(arg) => (
            <div className="min-h-[50px] flex flex-col items-start justify-start p-1">
              <div className="text-sm font-medium">{arg.dayNumberText}</div>
            </div>
          )}
        />

        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[450px] p-6">
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
              <button onClick={closeModal} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
                Huỷ
              </button>
              <button
                onClick={handleAddOrUpdateEvent}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                {selectedEvent ? "Lưu" : "Đăng ký"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

const SummaryCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center justify-between bg-white shadow border rounded-lg p-4">
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
    <div className="text-3xl">{icon}</div>
  </div>
);

const renderEventContent = (eventInfo: any) => {
  const shiftType = eventInfo.event.extendedProps.shiftType;
  const bgColor = shiftType === "morning" ? "bg-green-100" : "bg-purple-100";
  const order = shiftType === "morning" ? 0 : 1;
  return (
    <div
      className={`fc-event-main text-sm px-2 py-1 rounded shadow ${bgColor}`}
      style={{ color: "#222", minHeight: "22px", margin: "1px 0", order }}
    >
      {eventInfo.event.title}
    </div>
  );
};

export default Calendar;
