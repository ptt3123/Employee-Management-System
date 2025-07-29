
const EventItem = ({ eventInfo }: { eventInfo: any }) => {
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

export default EventItem;