import PageMeta from "../common/PageMeta";
import SummaryCard from "./SummaryCard";
import CheckInOut from "./CheckInOut";
import ShiftModal from "./ShiftModal";
import EventItem from "./EventItem";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarIcon, ClockIcon, AlertTriangleIcon, CalendarOffIcon } from "lucide-react";
import { useCalendar } from "../../hooks/useCalendar"; // Sửa lại đường dẫn hooks

const CalendarView = () => {
  const {
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
    isOpen,
    openModal,
    closeModal,
    formatTime,
  } = useCalendar();

  return (
    <>
      <PageMeta title="Đăng ký lịch làm" description="Chọn ca sáng hoặc chiều trong lịch" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard
            icon={<CalendarIcon className="text-green-500 w-6 h-6" />}
            label="Tổng công hưởng lương"
            value="27,5"
        />
        <SummaryCard
            icon={<ClockIcon className="text-blue-500 w-6 h-6" />}
            label="Tổng giờ làm thêm"
            value="20,0"
        />
        <SummaryCard
            icon={<AlertTriangleIcon className="text-orange-500 w-6 h-6" />}
            label="Tổng số lần đi muộn, về sớm"
            value="2"
        />
        <SummaryCard
            icon={<CalendarOffIcon className="text-red-500 w-6 h-6" />}
            label="Tổng số ngày nghỉ"
            value="1,0"
        />
        </div>


      <CheckInOut
        checkInTime={checkInTime}
        checkOutTime={checkOutTime}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        workingStatus={calculateWorkingStatus()}
        formatTime={formatTime}
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6">
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
          eventContent={(eventInfo) => <EventItem eventInfo={eventInfo} />}
          dayMaxEvents
          height="auto"
          contentHeight="auto"
          dayCellContent={(arg) => (
            <div className="min-h-[50px] flex flex-col items-start justify-start p-1">
              <div className="text-sm font-medium">{arg.dayNumberText}</div>
            </div>
          )}
        />

        <ShiftModal
          isOpen={isOpen}
          onClose={closeModal}
          shiftDate={shiftDate}
          shiftType={shiftType}
          setShiftDate={setShiftDate}
          setShiftType={setShiftType}
          onSubmit={handleAddOrUpdateEvent}
          selectedEvent={selectedEvent}
        />
      </div>
    </>
  );
};

export default CalendarView;
