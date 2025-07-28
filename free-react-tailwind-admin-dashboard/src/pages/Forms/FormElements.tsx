import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import LeaveRequestManager from "../../components/leave/LeaveRequestManager";

export default function FormElements() {
  return (
    <div>
      <PageMeta
        title="Quản lý nghỉ phép | TailAdmin"
        description="Trang quản lý nghỉ phép nhân viên"
      />
      <PageBreadcrumb pageTitle="From Elements" />
      <LeaveRequestManager />
    </div>
  );
}
