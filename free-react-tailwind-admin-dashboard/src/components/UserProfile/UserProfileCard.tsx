import { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { getEmployeeProfile, updateEmployeeProfile } from "../../api/staffApi";

export default function UserProfileCard() {
  const { accessToken } = useContext(AppContext)!;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    getEmployeeProfile(accessToken)
      .then((data) => {
        setProfile(data);
        setEditData({
          name: data.name || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
          dob: data.dob || "",
          address: data.address || "",
          password: "",
        });
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    if (!accessToken) {
      setError("Không tìm thấy access token.");
      setSaving(false);
      return;
    }
    try {
      await updateEmployeeProfile(editData, accessToken);
      setProfile((prev: any) => ({ ...prev, ...editData }));
      setShowEdit(false);
      setSuccess("Cập nhật thành công!");
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10 text-lg">Đang tải thông tin...</div>;
  if (!profile) return <div className="text-center py-10 text-red-500">Không tìm thấy thông tin nhân viên.</div>;

  // Ảnh bìa và avatar mẫu (có thể thay bằng ảnh thật nếu backend trả về)
  const coverUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";
  const avatarUrl = "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile.name || "User") + "&background=0D8ABC&color=fff&size=128";

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Cover */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={coverUrl}
          alt="cover"
          className="object-cover w-full h-full"
        />
        {/* Avatar */}
        <div className="absolute left-1/2 -bottom-14 transform -translate-x-1/2">
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover bg-white"
          />
        </div>
      </div>
      {/* Thông tin nhân viên */}
      <div className="pt-20 pb-8 px-8">
        <div className="flex flex-col items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-700">{profile.name}</h2>
          <div className="text-gray-500 uppercase tracking-widest text-sm mt-1">| {profile.role} |</div>
        </div>
        <div className="flex flex-col items-center gap-2 text-gray-800 text-base mb-4">
          <div>
            <span className="font-semibold inline-block mr-2">📧 Email:</span>
            {profile.email}
          </div>
          <div>
            <span className="font-semibold inline-block mr-2">🏠 Địa chỉ:</span>
            {profile.address}
          </div>
          <div>
            <span className="font-semibold inline-block mr-2">📅 Ngày tạo:</span>
            {profile.create_date}
          </div>
          <div>
            <span className="font-semibold inline-block mr-2">📱 Số điện thoại:</span>
            {profile.phone_number}
          </div>
          <div>
            <span className="font-semibold inline-block mr-2">🎂 Ngày sinh:</span>
            {profile.dob}
          </div>
          <div>
            <span className="font-semibold inline-block mr-2">🔖 Trạng thái:</span>
            <span className={profile.status === "ACTIVE" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
              {profile.status}
            </span>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            onClick={() => setShowEdit(true)}
          >
            Chỉnh sửa thông tin
          </button>
        </div>
        {success && <div className="text-green-600 mt-4 text-center">{success}</div>}
        {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
      </div>

      {/* Popup edit */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowEdit(false)}></div>
          <form
            className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-lg p-8 z-10 animate-fade-in"
            onSubmit={handleEditSubmit}
          >
            <h3 className="text-xl font-bold mb-6 text-center text-blue-700">Chỉnh sửa thông tin</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Họ tên</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Số điện thoại</label>
                <input
                  type="text"
                  name="phone_number"
                  value={editData.phone_number}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={editData.address}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Ngày sinh</label>
                <input
                  type="date"
                  name="dob"
                  value={editData.dob}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Mật khẩu mới</label>
                <input
                  type="password"
                  name="password"
                  value={editData.password}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Để trống nếu không đổi"
                />
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-8">
              <button
                type="button"
                className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowEdit(false)}
                disabled={saving}
              >
                Huỷ
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                disabled={saving}
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
            {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
          </form>
        </div>
      )}
    </div>
  );
}