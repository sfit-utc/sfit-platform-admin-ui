"use client";
import Modal from "@/components/ui/modal";
import { useEffect, useState } from "react";
import { useMember, useMemberManagement } from "@/hooks/use-member-service";
import { memberService } from "@/services/member-service";
import { teamService } from "@/services/team-service";
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
  const { updateMemberInfo, loading: saving } = useMemberManagement();
  const teamList = [
    "Học tập",
    "Hậu cần",
    "Đối ngoại",
    "Truyền thông",
    "Kỹ thuật",
    "Data & AI",
    "IOT",
    "Game",
    "Web App",
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
  const [availableTeams, setAvailableTeams] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (member && open) {
      setName(member.name || "");
      setEmail(member.email || "");
      setRole(member.role || "");
      setClassNameField(member.class || "");
      setTeams(member.teams || []);

      // Load actual team-specific roles
      loadMemberTeamRoles();
    }
  }, [member, open]);

  const loadMemberTeamRoles = async () => {
    if (!member) return;

    try {
      // Get detailed member info with team roles
      const memberInfo = await memberService.getMemberInfo(
        member.userId || String(memberId)
      );

      // Initialize team role map with actual roles from backend
      const init: Record<string, string> = {};
      if (memberInfo.teamRoles) {
        // Use the actual team-specific roles from the API
        Object.assign(init, memberInfo.teamRoles);
      } else if (memberInfo.teams && memberInfo.teams.length > 0) {
        // Fallback: use primary role for all teams
        memberInfo.teams.forEach((teamName: string) => {
          init[teamName] = memberInfo.role || "Thành viên";
        });
      }
      setTeamRoles(init);
    } catch (error) {
      console.error("Error loading member team roles:", error);
      // Fallback to default roles
      const init: Record<string, string> = {};
      (member.teams || []).forEach((t) => {
        init[t] = member.role || "Thành viên";
      });
      setTeamRoles(init);
    }
  };

  // Load available teams when modal opens
  useEffect(() => {
    const loadTeams = async () => {
      if (open) {
        try {
          const teams = await memberService.getAvailableTeams();
          setAvailableTeams(teams);
        } catch (error) {
          console.error("Error loading teams:", error);
        }
      }
    };
    loadTeams();
  }, [open]);

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
    setError(null);

    if (!member) return;

    try {
      const userId = member.userId || String(memberId);
      const originalTeams = member.teams || [];

      // Find teams to add, remove, and update
      const teamsToAdd = teams.filter((team) => !originalTeams.includes(team));
      const teamsToRemove = originalTeams.filter(
        (team) => !teams.includes(team)
      );
      const teamsToUpdate = teams.filter(
        (team) =>
          originalTeams.includes(team) &&
          teamRoles[team] &&
          teamRoles[team] !== (member.teamRoles?.[team] || "Thành viên")
      );

      // Add user to new teams
      for (const teamName of teamsToAdd) {
        // Find team ID from available teams
        const team = availableTeams.find((t) => t.name === teamName);
        if (team) {
          const role = teamRoles[teamName] || "Thành viên";
          await memberService.addUserToTeam(team.id, userId, role);
        }
      }

      // Update roles for existing team memberships
      for (const teamName of teamsToUpdate) {
        // Find team ID from available teams
        const team = availableTeams.find((t) => t.name === teamName);
        if (team) {
          const newRole = teamRoles[teamName];
          await memberService.addUserToTeam(team.id, userId, newRole);
        }
      }

      // Remove user from teams
      for (const teamName of teamsToRemove) {
        // Find team ID from available teams
        const team = availableTeams.find((t) => t.name === teamName);
        if (team) {
          try {
            await teamService.removeMemberFromTeam(team.id, userId);
          } catch (error) {
            console.error(
              `Failed to remove user from team ${teamName}:`,
              error
            );
            // Continue with other operations even if one removal fails
          }
        }
      }

      if (onSaved) {
        onSaved();
      }
      onClose();
    } catch (error: any) {
      console.error("Error updating member teams:", error);
      setError(error.message || "Có lỗi xảy ra khi cập nhật thành viên");
    }
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
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}
        {loading || !member ? (
          <div>Đang tải...</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Họ và tên</label>
              <input
                value={name}
                readOnly
                className="mt-1 w-full p-2 border rounded-md bg-gray-100"
                style={{
                  backgroundColor: "var(--sfit-gray-100)",
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
                readOnly
                className="mt-1 w-full p-2 border rounded-md bg-gray-100"
                style={{
                  backgroundColor: "var(--sfit-gray-100)",
                  color: "var(--foreground)",
                  borderColor: "var(--sfit-gray-200)",
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Lớp</label>
              <input
                value={classNameField}
                readOnly
                className="mt-1 w-full p-2 border rounded-md bg-gray-100"
                style={{
                  backgroundColor: "var(--sfit-gray-100)",
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
