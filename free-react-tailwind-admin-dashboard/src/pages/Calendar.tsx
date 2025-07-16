import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";

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
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const shiftMap: Record<string, string> = {
    morning: "Ca sáng (08:30 - 12:30)",
    afternoon: "Ca chiều (13:30 - 17:30)",
  };

  useEffect(() => {
    setEvents([]);
  }, []);

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
      title: shiftLabel,
      start: shiftDate,
      end: shiftDate,
      allDay: true,
      extendedProps: {
        shift: shiftLabel,
        shiftType: shiftType,
      },
    };

    // Nhóm các events theo ngày
    const otherEvents = events.filter((e) => e.start !== shiftDate);
    const sameDayEvents = events
      .filter((e) => e.start === shiftDate)
      .concat(newEvent)
      .sort((a, b) => {
        return a.extendedProps.shiftType === "morning" ? -1 : 1;
      });

    setEvents([...otherEvents, ...sameDayEvents]);
    closeModal();
    resetModalFields();
  };

  const resetModalFields = () => {
    setShiftDate("");
    setShiftType("morning");
    setSelectedEvent(null);
  };

  return (
    <>
      <PageMeta title="Đăng ký lịch làm" description="Chọn ca sáng hoặc chiều trong lịch" />
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
          eventContent={renderEventContent}
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
                  Ca sáng (08:30 - 12:30)
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

const renderEventContent = (eventInfo: any) => {
  return (
    <div className="fc-event-main p-1 rounded bg-blue-100 !text-black text-sm shadow-sm">
      {eventInfo.event.title}
    </div>
  );
};

export default Calendar;
