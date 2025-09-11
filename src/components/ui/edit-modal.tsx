"use client";
import Modal from "@/components/ui/modal";
import { useEffect, useState } from "react";
import { useMember, useMemberManagement } from "@/hooks/use-member-service";
import { memberService } from "@/services/member-service";
export default function EditModal({
  open,
  onClose,
  memberId,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  memberId: number | string;
  onSaved?: () => void;
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
  const [teamRoles, setTeamRoles] = useState<Record<string, string>>({});

  useEffect(() => {
    if (member && open) {
      setName(member.name || "");
      setEmail(member.email || "");
      setRole(member.role || "");
      setClassNameField(member.class || "");
      setTeams(member.teams || []);
      // initialize team role map with default role
      const init: Record<string, string> = {};
      (member.teams || []).forEach((t) => {
        init[t] = member.role || "Thành viên";
      });
      setTeamRoles(init);
    }
  }, [member, open]);

  const toggleTeam = (team: string) => {
    setTeams((prev: string[]) =>
      prev.includes(team)
        ? prev.filter((t: string) => t !== team)
        : [...prev, team]
    );
    setTeamRoles((prev) => {
      const next = { ...prev };
      if (next[team]) delete next[team];
      else next[team] = "Thành viên";
      return next;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // Update profile basics first
    await updateMember(memberId as any, {
      name,
      email,
      role,
      class: classNameField,
      teams,
    });
    // Compute removals and additions/updates
    const originalTeams = member?.teams || [];
    const toRemove = originalTeams.filter((t) => !teams.includes(t));
    const toUpsert = teams.map((team) => ({
      team,
      role: teamRoles[team] || "Thành viên",
    }));
    if (toRemove.length > 0) {
      await memberService.removeMemberFromTeams(String(memberId), toRemove);
    }
    if (toUpsert.length > 0) {
      await memberService.addMemberToTeamsWithRoles(String(memberId), toUpsert);
    }
    if (onSaved) {
      onSaved();
    }
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
                Ban trực thuộc & vai trò theo ban
              </label>
              <div
                className="border rounded-md p-3 mt-1 grid grid-cols-2 gap-2 max-h-64 overflow-y-auto"
                style={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--sfit-gray-200)",
                }}
              >
                {teamList.map((team) => (
                  <div key={team} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={teams.includes(team)}
                      onChange={() => toggleTeam(team)}
                    />
                    <span className="min-w-[100px]">{team}</span>
                    {teams.includes(team) && (
                      <select
                        value={teamRoles[team] || role}
                        onChange={(e) =>
                          setTeamRoles((prev) => ({
                            ...prev,
                            [team]: e.target.value,
                          }))
                        }
                        className="ml-auto p-1 border rounded"
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
                    )}
                  </div>
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
