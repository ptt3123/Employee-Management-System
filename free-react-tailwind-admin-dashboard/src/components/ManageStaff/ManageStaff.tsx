// components/StaffTable.tsx
import  { useEffect, useState } from "react";
import Button from "../ui/button/Button";
{/*import { Modal } from "../ui/modal"; */}
import { useModal } from "../../hooks/useModal";
import { Staff } from "../../types/staff";
import { Team } from "../../types/team";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { getAllStaff , createStaff , updateStaff} from "../../api/staffApi";
import { getTeams } from "../../api/staffTeamApi";

interface Props {
  token: string;
}


export default function StaffTable({ token }: Props) {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const [teamId, setTeamId] = useState<string | null>(null);
  const [searchBy, setSearchBy] = useState<string>("name");
  const [searchValue, setSearchValue] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const { isOpen, openModal, closeModal } = useModal();
  const [showAddModal, setShowAddModal] = useState(false);
  const [employeeStatus, setEmployeeStatus] = useState<string>("ACTIVE");
  const [newStaffData, setNewStaffData] = useState<Partial<Staff>>({
    name: "",
    email: "",
    phone_number: "",
    address: "",
    dob: "",
    status: "ACTIVE", // Mặc định là "Đang làm"
  });
  const fetchStaff = async () => {
    try {
      const { employees, total_pages } = await getAllStaff(
        token,
        page,
        pageSize,
        teamId,
        searchBy,
        searchValue,
        sortBy,
        sortOrder,
        employeeStatus
      );
      setStaffList(employees);
      setTotalPages(total_pages);
    } catch (error) {
      console.error("Lỗi lấy nhân viên:", error);
    }
  };
  const handleAdd = async () => {
    try {
      await createStaff(newStaffData as Staff, token);
      setShowAddModal(false);
      fetchStaff();
    } catch (err) {
      console.error("Lỗi tạo nhân viên mới:", err);
    }
  };

  const [teamOptions, setTeamOptions] = useState<Team[]>([]);
  useEffect(() => {
  const fetchTeams = async () => {
      try {
        const teams = await getTeams(token);
        setTeamOptions(teams);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách team:", error);
      }
    };

  fetchTeams();
}, [token]); // chỉ chạy 1 lần khi component mount


  useEffect(() => {
    fetchStaff();
  }, [token, page, pageSize, teamId, searchBy, searchValue, sortBy, sortOrder, employeeStatus]);

  const handleEdit = (staff: Staff) => {
    setSelectedStaff(staff);
    openModal();
  };


  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(field);
      setSortOrder("ASC");
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchStaff();
  };

  const convertDate = (date: string, toSlash = true) =>
  date ? date.replace(/[-/]/g, toSlash ? "/" : "-") : "";
  function handleInputChange(field: string, value: any) {
  setSelectedStaff((prev) =>
    prev ? { ...prev, [field]: value } : prev
  );
  }

  async function handleSaveStaff() {
  if (!selectedStaff) return;

  try {
    await updateStaff(selectedStaff.id!, selectedStaff, token); // 👈 Gọi API update
    console.log("Đã cập nhật:", selectedStaff);
    closeModal();
    fetchStaff(); // 👈 Reload lại danh sách
  } catch (error) {
    console.error("Lỗi cập nhật nhân viên:", error);
  }
}



  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold mb-4">Danh sách nhân viên</h2>
          <Button
              onClick={() => setShowAddModal(true)}
              className="bg-green-500 text-white px-3 py-1 rounded flex items-center gap-2"
            >
              Thêm nhân viên
          </Button>
        
        {showAddModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
              {/* Nền mờ */}
              <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
                onClick={() => setShowAddModal(false)}
              ></div>

              {/* Popup nội dung */}
              <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md z-[9999]">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
              <h2 className="text-xl font-semibold mb-4">Thêm nhân viên mới</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Họ tên"
                  value={newStaffData.name || ""}
                  onChange={(e) => setNewStaffData({ ...newStaffData, name: e.target.value })}
                  className="border p-2 rounded w-full text-sm"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newStaffData.email || ""}
                  onChange={(e) => setNewStaffData({ ...newStaffData, email: e.target.value })}
                  className="border p-2 rounded w-full text-sm"
                />
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  value={newStaffData.phone_number || ""}
                  onChange={(e) => setNewStaffData({ ...newStaffData, phone_number: e.target.value })}
                  className="border p-2 rounded w-full text-sm"
                />
                <input
                  type="text"
                  placeholder="Địa chỉ"
                  value={newStaffData.address || ""}
                  onChange={(e) => setNewStaffData({ ...newStaffData, address: e.target.value })}
                  className="border p-2 rounded w-full text-sm"
                />
                <input
                    type="date"
                    onChange={(e) =>{
                      const updatedDob = convertDate(e.target.value, false);
                      setNewStaffData({ ...newStaffData, dob: updatedDob });
                      console.log("DOB:", newStaffData.dob);
                    }
                    }
                  />
                <select
                  value={newStaffData.status || "active"}
                  onChange={(e) =>
                    setNewStaffData({ ...newStaffData, status: e.target.value as Staff["status"] })
                  }
                  className="border p-2 rounded w-full text-sm"
                >
                  <option value="ACTIVE">Đang làm</option>
                  <option value="RESIGNED">Đã nghỉ</option>
                  <option value="TERMINATED">Đuổi việc</option>
                  <option value="RETIRED">Nghỉ hưu</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-300 px-4 py-1.5 text-sm rounded"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleAdd}
                  className="bg-green-500 text-white px-4 py-1.5 text-sm rounded"
                >
                  Lưu
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mb-4 items-end">
        {/* Dropdown Team */}
        <select
          value={teamId ?? ""}
          onChange={(e) => setTeamId(e.target.value)}
          className="border px-3 h-10 rounded"
        >
          <option value="">Tất cả team</option>
          {teamOptions.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        {/* Dropdown 1 - Search Field */}
        <div className="flex flex-col">
          <select className="w-48 border px-3 h-10 rounded text-sm"
            onChange={(e) => setEmployeeStatus(e.target.value)}
          >
            <option disabled selected>-- Chọn --</option>
            <option value="ACTIVE"> Đang làm việc</option>
            <option value="RESIGNED">Đã nghỉ việc</option>
            <option value="TERMINATED">Bị đuổi việc</option>
            <option value="RETIRED">Đã nghỉ hưu</option>
          </select>
        </div>

        {/* Dropdown 2 - Sort Field */}
        <div className="flex flex-col">
          <select className="w-48 border px-3 h-10 rounded text-sm"
            onChange={(e) => setSearchBy(e.target.value)}
          >
            <option disabled selected>-- Chọn --</option>
            <option value="name">Họ và tên</option>
            <option value="email">Email</option>
            <option value="dob">Ngày sinh</option>
            <option value="phone_number">Số điện thoại</option>
            <option value="team_name">Phòng ban</option>
            <option value="position">Vị trí</option>
            <option value="status">Trạng thái</option>
          </select>
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="border px-3 h-10 rounded"
        />

        {/* Button */}
        <Button className="h-10 px-4" onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </div>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            {[  
              { key: "ID", label: "STT" },
              { key: "name", label: "Họ và Tên" },
              { key: "username", label: "Username" },
              { key: "email", label: "Email" },
              { key: "phone_number", label: "Số điện thoại" },
              { key: "dob", label: "Ngày sinh" },
              { key: "team_name", label: "Phòng ban" },
              { key: "position", label: "Vị trí" },
              { key: "address", label: "Địa chỉ" },
              { key: "status", label: "Trạng thái" },
              { key: "actions", label: "Hành động" },
              { key: "is_working", label: "" },
              
            ].map(({ key, label }) => (
              <th
                key={key}
                className="border px-2 py-1 cursor-pointer"
                onClick={() => handleSort(key)}
              >
                {label}
                {sortBy === key && (
                  <FontAwesomeIcon icon={sortOrder === "ASC" ? faSortUp : faSortDown} className="ml-1" />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff, index) => (
            <tr key={staff.id ?? `${staff.email}-${index}`} className="text-center">
              <td className="border px-2 py-1">{(page - 1) * pageSize + index + 1}</td>
              <td className="border px-2 py-1">{staff.name}</td>
              <td className="border px-2 py-1">{staff.username}</td>
              <td className="border px-2 py-1">{staff.email}</td>
              <td className="border px-2 py-1">{staff.phone_number}</td>
              <td className="border px-2 py-1">{staff.dob}</td>
              <td className="border px-2 py-1">{staff.team_name || "-"}</td>
              <td className="border px-2 py-1">{staff.position || "-"}</td>
              <td className="border px-2 py-1">{staff.address || "-"}</td>
              <td className="border px-2 py-1">{staff.status}</td>
              
              <td className="border px-2 py-1 flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(staff)}
                  className="bg-blue-100 hover:bg-blue-200 p-2 rounded-lg transition duration-150"
                  title="Chỉnh sửa"
                >
                  <FontAwesomeIcon icon={faPenToSquare} className="text-blue-600" />
                </button>
                
              </td>
              <td className="border px-2 py-1">
                <div
                  className={`w-3 h-3 rounded-full mx-auto ${
                    staff.is_working ? "bg-green-500" : "bg-red-500"
                  }`}
                  title={staff.is_working ? "Đang làm việc" : "Không làm việc"}
                ></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center items-center mt-4 gap-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Trang trước
        </button>
        <span className="mx-4">Trang {page} / {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page >= totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Trang sau
        </button>
      </div>

      
    {isOpen && selectedStaff && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        {/* Nền mờ */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
          onClick={closeModal}
        ></div>

        {/* Nội dung popup */}
        <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md z-[9999]">
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
          <h2 className="text-xl font-semibold mb-4">Chỉnh sửa thông tin nhân viên</h2>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Họ tên"
              value={selectedStaff.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="border p-2 rounded w-full text-sm"
            />

            <input
              type="email"
              placeholder="Email"
              value={selectedStaff.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="border p-2 rounded w-full text-sm"
            />

            <input
              type="text"
              placeholder="Số điện thoại"
              value={selectedStaff.phone_number}
              onChange={(e) => handleInputChange("phone_number", e.target.value)}
              className="border p-2 rounded w-full text-sm"
            />

            <input
              type="text"
              placeholder="Địa chỉ"
              value={selectedStaff.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="border p-2 rounded w-full text-sm"
            />

            <input
              type="date"
              value={selectedStaff.dob}
              onChange={(e) => handleInputChange("dob", e.target.value)}
              className="border p-2 rounded w-full text-sm"
            />

            <input
              type="text"
              placeholder="Vị trí"
              value={selectedStaff.position || ""}
              onChange={(e) => handleInputChange("position", e.target.value)}
              className="border p-2 rounded w-full text-sm"
            />

            <input
              type="text"
              placeholder="Tên nhóm"
              value={selectedStaff.team_name || ""}
              onChange={(e) => handleInputChange("team_name", e.target.value)}
              className="border p-2 rounded w-full text-sm"
            />

            <select
              value={selectedStaff.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="border p-2 rounded w-full text-sm"
            >
              <option value="ACTIVE">Đang làm</option>
              <option value="RESIGNED">Đã nghỉ</option>
              <option value="TERMINATED">Đuổi việc</option>
              <option value="RETIRED">Nghỉ hưu</option>
            </select>

          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              onClick={closeModal}
              className="bg-gray-300 px-4 py-1.5 text-sm rounded"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSaveStaff}
              className="bg-green-500 text-white px-4 py-1.5 text-sm rounded"
            >
              Lưu
            </Button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
