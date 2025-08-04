import { useState, useRef, useEffect, useContext } from "react";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { useModal } from "./useModal";
import { AppContext } from "../context/AppContext";
import { 
  checkin, 
  checkout, 
  createDtkRegisForm,
  checkIfRegisteredDtk,
  deleteRegisteredScheduleNextWeek
} from "../api/datetimekeepingApi";
import { DayTimeKeepingRegisForm } from "../types/datetimekeeping";

export interface CalendarEvent extends EventInput {
  extendedProps: {
    shift: string;
    shiftStart: string;
    shiftEnd: string;
  };
}

export const useCalendar = () => {
  const { accessToken } = useContext(AppContext)!;
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [shiftStart, setShiftStart] = useState("08:00");
  const [shiftEnd, setShiftEnd] = useState("17:00");
  const [shiftDate, setShiftDate] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const calendarRef = useRef<any>(null);
  const { isOpen, openModal, closeModal } = useModal();

  // API functions
  const handleCheckIn = async () => {
    if (!accessToken) {
      alert("Vui lòng đăng nhập lại!");
      return;
    }
    
    setLoading(true);
    try {
      const response = await checkin(accessToken);
      console.log("✅ Check-in thành công:", response);
      const now = new Date().toISOString();
      setCheckInTime(now);
      alert("Check-in thành công!");
    } catch (error: any) {
      console.error("❌ Check-in thất bại:", error);
      alert(`Check-in thất bại: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!accessToken) {
      alert("Vui lòng đăng nhập lại!");
      return;
    }
    
    setLoading(true);
    try {
      const response = await checkout(accessToken);
      console.log("✅ Check-out thành công:", response);
      const now = new Date().toISOString();
      setCheckOutTime(now);
      alert("Check-out thành công!");
    } catch (error: any) {
      console.error("❌ Check-out thất bại:", error);
      alert(`Check-out thất bại: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is registered for DTK
  const checkRegistrationStatus = async () => {
    if (!accessToken) return;
    
    try {
      const response = await checkIfRegisteredDtk(accessToken);
      setIsRegistered(response.message === "True");
    } catch (error) {
      console.error("❌ Kiểm tra đăng ký thất bại:", error);
    }
  };

  // Register for DTK schedule - Fixed API format
  const registerSchedule = async (scheduleData: DayTimeKeepingRegisForm) => {
    if (!accessToken) {
      alert("Vui lòng đăng nhập lại!");
      return false;
    }
    
    setLoading(true);
    try {
      // ✅ Fix: API expects array directly, extract from regis_list
      const response = await createDtkRegisForm(accessToken, scheduleData.regis_list);
      console.log("✅ Đăng ký lịch thành công:", response);
      alert("Đăng ký lịch làm việc thành công!");
      await checkRegistrationStatus(); // Refresh status
      return true;
    } catch (error: any) {
      console.error("❌ Đăng ký lịch thất bại:", error);
      alert(`Đăng ký lịch thất bại: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete registered schedule
  const deleteSchedule = async () => {
    if (!accessToken) {
      alert("Vui lòng đăng nhập lại!");
      return;
    }
    
    if (!confirm("Bạn có chắc muốn xóa lịch đăng ký?")) return;
    
    setLoading(true);
    try {
      const response = await deleteRegisteredScheduleNextWeek(accessToken);
      console.log("✅ Xóa lịch thành công:", response);
      alert("Xóa lịch đăng ký thành công!");
      await checkRegistrationStatus(); // Refresh status
    } catch (error: any) {
      console.error("❌ Xóa lịch thất bại:", error);
      alert(`Xóa lịch thất bại: ${error.message}`);
    } finally {
      setLoading(false);
    }
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

  // Check registration status when accessToken is available
  useEffect(() => {
    if (accessToken) {
      checkRegistrationStatus();
    }
  }, [accessToken]);

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

  const handleAddOrUpdateEvent = async () => {
    const shiftLabel = `${shiftStart} - ${shiftEnd}`;
    const isDuplicate = events.some(
      (e) => e.start === shiftDate && e.extendedProps.shift === shiftLabel
    );

    if (isDuplicate) {
      alert("Ca làm này đã được đăng ký trong ngày.");
      return;
    }

    // ✅ Call API để đăng ký - gửi array trực tiếp
    const scheduleData = [
      {
        date: shiftDate,
        shift_start: shiftStart,
        shift_end: shiftEnd,
      }
    ];
    
    const success = await registerSchedule({ regis_list: scheduleData });
    if (!success) return;

    // ✅ Chỉ update UI khi API thành công
    const newEvent: CalendarEvent = {
      id: `${shiftDate}-${shiftStart}-${shiftEnd}`,
      title: `${shiftLabel}`,
      start: shiftDate,
      end: shiftDate,
      allDay: true,
      extendedProps: {
        shift: shiftLabel,
        shiftStart: shiftStart,
        shiftEnd: shiftEnd,
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
          // Sort by start time
          return a.extendedProps.shiftStart.localeCompare(b.extendedProps.shiftStart);
        })
        .forEach(ev => sortedEvents.push(ev));
    });

    setEvents(sortedEvents);
    closeModal();
    resetModalFields();
  };

  const resetModalFields = () => {
    setShiftDate("");
    setShiftStart("08:00");
    setShiftEnd("17:00");
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
    shiftStart,
    shiftEnd,
    setShiftDate,
    setShiftStart,
    setShiftEnd,
    selectedEvent,
    setSelectedEvent,
    isOpen,
    openModal,
    closeModal,
    formatTime,
    // ✅ API-related exports 
    isRegistered,
    loading,
    registerSchedule,
    deleteSchedule,
    checkRegistrationStatus,
  };
};
