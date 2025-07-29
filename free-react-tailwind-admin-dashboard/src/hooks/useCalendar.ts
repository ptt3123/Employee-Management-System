import { useState, useRef, useEffect } from "react";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { useModal } from "./useModal";

export interface CalendarEvent extends EventInput {
  extendedProps: {
    shift: string;
    shiftType: "morning" | "afternoon";
  };
}

export const useCalendar = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [shiftType, setShiftType] = useState<"morning" | "afternoon">("morning");
  const [shiftDate, setShiftDate] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const calendarRef = useRef<any>(null);
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
    const savedEvents = localStorage.getItem("calendar_events");
    if (savedEvents) {
      try {
        const parsed = JSON.parse(savedEvents);
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
          return a.extendedProps.shiftType === "morning" ? -1 : 1;
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

  const formatTime = (iso: string | null): string => {
    if (!iso) return "--:--";
    const d = new Date(iso);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return {
    calendarRef,
    events,
    checkInTime,
    checkOutTime,
    handleCheckIn,
    handleCheckOut,
    calculateWorkingStatus,
    handleDateSelect,
    handleEventClick,
    handleAddOrUpdateEvent,
    shiftDate,
    shiftType,
    setShiftDate,
    setShiftType,
    selectedEvent,
    setSelectedEvent,
    isOpen,
    openModal,
    closeModal,
    formatTime,
  };
};
