"use client";
import Modal from "@/components/ui/modal";
import { useEffect, useState } from "react";
import { useMember, useMemberManagement } from "@/hooks/use-member-service";
export default function EditModal({
  open,
  onClose,
  memberId,
}: {
  open: boolean;
  onClose: () => void;
  memberId: number;
}) {
  const { data: member, loading } = useMember(memberId);
  const { updateMember, loading: saving } = useMemberManagement();
  const teamList = [
    "Học tập",
    "Hậu cần",
    "Đối ngoại",
    "Truyền thông",
    "Kỹ thuật",
    "Data & AI",
    "IOT",
    "Game",
    "Web",
    "Chuyên môn",
    "Cán sự",
    "Chủ nhiệm",
  ];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [classNameField, setClassNameField] = useState("");
  const [teams, setTeams] = useState<string[]>([]);

  useEffect(() => {
    if (member && open) {
      setName(member.name || "");
      setEmail(member.email || "");
      setRole(member.role || "");
      setClassNameField(member.class || "");
      setTeams(member.teams || []);
    }
  }, [member, open]);

  const toggleTeam = (team: string) => {
    setTeams((prev: string[]) =>
      prev.includes(team)
        ? prev.filter((t: string) => t !== team)
        : [...prev, team]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMember(memberId, {
      name,
      email,
      role,
      class: classNameField,
      teams,
    });
    onClose();
  };

  return (
    <Modal
      state={open}
      funcClickToBack={() => onClose()}
      className="w-full max-w-2xl z-1000"
    >
      <form onSubmit={handleSave} className="space-y-4 p-1">
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--sfit-green)" }}
        >
          Chỉnh sửa thành viên
        </h2>
        {loading || !member ? (
          <div>Đang tải...</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Họ và tên</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--sfit-gray-200)",
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--sfit-gray-200)",
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Chức vụ</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--sfit-gray-200)",
                }}
              >
                <option value="Chủ nhiệm">Chủ nhiệm</option>
                <option value="Phó CN">Phó CN</option>
                <option value="Trưởng ban">Trưởng ban</option>
                <option value="Phó ban">Phó ban</option>
                <option value="Thành viên">Thành viên</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Lớp</label>
              <input
                value={classNameField}
                onChange={(e) => setClassNameField(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--sfit-gray-200)",
                }}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium">
                Ban trực thuộc
              </label>
              <div
                className="border rounded-md p-3 mt-1 grid grid-cols-2 gap-2 max-h-48 overflow-y-auto"
                style={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--sfit-gray-200)",
                }}
              >
                {teamList.map((team) => (
                  <label key={team} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={teams.includes(team)}
                      onChange={() => toggleTeam(team)}
                    />
                    {team}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
            style={{ borderColor: "var(--sfit-gray-200)" }}
            disabled={saving}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-60"
            disabled={saving}
          >
            Lưu
          </button>
        </div>
      </form>
    </Modal>
  );
}
