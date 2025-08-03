import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import LeaveRequestManager from "./LeaveRequestManager";
import LeaveRequestStaff from "./leaveRequestStaff";

export default function LeaveSwitcher() {
  const { user } = useContext(AppContext)!;
  if (!user) return null;
  if (user.role === "ADMIN") return <LeaveRequestManager />;
  if (user.role === "STAFF") return <LeaveRequestStaff />;
  return <div>Bạn không có quyền truy cập chức năng này</div>;
}