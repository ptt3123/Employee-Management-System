const EventItem = ({ eventInfo }: { eventInfo: any }) => {
  // Nếu là ngày đã đăng ký, bôi xanh toàn ô và chỉ hiện dấu tích
  const isRegistered = eventInfo.event.extendedProps.isRegistered;
  return (
    <div
      className={`fc-event-main flex items-center justify-center h-full w-full rounded-lg ${isRegistered ? "bg-green-200" : ""}`}
      style={{ minHeight: "60px" }}
    >
      {isRegistered && (
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  );
};

export default EventItem;