"use client";
import Modal from "@/components/ui/modal";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMember, useMemberManagement } from "@/hooks/use-member-service";
import { memberService } from "@/services/member-service";
import { teamService } from "@/services/team-service";
import { useAuth } from "@/hooks/use-auth";
import { useUserTeams } from "@/hooks/use-team-service";
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
  const { loading: saving } = useMemberManagement();

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

  // Use available teams from API instead of hardcoded list
  const teamList = availableTeams.map((team) => team.name);

  // Current user permissions
  const { user } = useAuth();
  const currentUserId = user?.id || "";
  const { userTeams: myTeams } = useUserTeams(currentUserId);

  // Check if current user is admin
  const isAdmin = useMemo(() => {
    return user?.role === "admin";
  }, [user]);

  // Check if admin is editing their own profile
  const isEditingSelf = useMemo(() => {
    return isAdmin && user?.id === (member?.userId || String(memberId));
  }, [isAdmin, user?.id, member?.userId, memberId]);

  const isCNAdmin = useMemo(() => {
    // User is HEADER or VICE in team "Chủ nhiệm"
    const cn = myTeams.find(
      (t: any) => (t?.name || "").toLowerCase() === "chủ nhiệm"
    );
    if (!cn) return false;
    const roles = Array.isArray(cn.role) ? cn.role : [cn.role];
    const upper = roles.map((r: any) => String(r).toUpperCase());
    return upper.includes("HEADER") || upper.includes("VICE");
  }, [myTeams]);

  const canEditTeamByName = (teamName: string) => {
    // Admin can edit any team
    if (isAdmin) return true;
    // Chủ nhiệm/Phó CN can edit any team
    if (isCNAdmin) return true;
    // Check if user is HEADER of the specific team
    const t = myTeams.find(
      (x: any) => (x?.name || "").toLowerCase() === teamName.toLowerCase()
    );
    if (!t) return false;
    const roles = Array.isArray(t.role) ? t.role : [t.role];
    const upper = roles.map((r: any) => String(r).toUpperCase());
    return upper.includes("HEADER");
  };

  // const loadMemberTeamRoles = async () => {
  //   if (!member) return;

  //   try {
  //     // Get detailed member info with team roles
  //     const memberInfo = await memberService.getMemberInfo(
  //       member.userId || String(memberId)
  //     );

  //     // Initialize team role map with actual roles from backend
  //     const init: Record<string, string> = {};
  //     if (memberInfo.teamRoles) {
  //       // Use the actual team-specific roles from the API
  //       Object.assign(init, memberInfo.teamRoles);
  //     } else if (memberInfo.teams && memberInfo.teams.length > 0) {
  //       // Fallback: use primary role for all teams
  //       memberInfo.teams.forEach((teamName: string) => {
  //         init[teamName] = memberInfo.role || "Thành viên";
  //       });
  //     }
  //     setTeamRoles(init);
  //   } catch (error) {
  //     console.error("Error loading member team roles:", error);
  //     // Fallback to default roles
  //     const init: Record<string, string> = {};
  //     (member.teams || []).forEach((t) => {
  //       init[t] = member.role || "Thành viên";
  //     });
  //     setTeamRoles(init);
  //   }
  // };
  const loadMemberTeamRoles = useCallback(async () => {
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
  }, [member, memberId]);

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
  }, [member, open, loadMemberTeamRoles]);

  // Load available teams when modal opens
  useEffect(() => {
    const loadTeams = async () => {
      if (open) {
        try {
          console.log("Loading available teams...");
          const teams = await memberService.getAvailableTeams();
          console.log("Available teams loaded:", teams);
          setAvailableTeams(teams);
        } catch (error) {
          console.error("Error loading teams:", error);
        }
      }
    };
    loadTeams();
  }, [open]);

  const toggleTeam = (team: string) => {
    if (!canEditTeamByName(team)) {
      setError(
        "Bạn không có quyền chỉnh sửa ban này. Chỉ Admin, Chủ nhiệm/Phó CN hoặc Chủ nhiệm của chính ban đó mới được phép."
      );
      return;
    }
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

      // Check if admin is trying to change their own role
      if (isAdmin && user?.id === userId) {
        // Check if admin is trying to remove themselves from all teams
        if (teams.length === 0) {
          setError(
            "Admin không thể rời khỏi tất cả các ban. Vui lòng liên hệ quản trị viên khác."
          );
          return;
        }

        // Check if admin is trying to remove themselves from important teams
        const hasImportantTeam = teams.some(
          (team: string) =>
            team.toLowerCase().includes("chủ nhiệm") ||
            team.toLowerCase().includes("admin")
        );

        if (
          !hasImportantTeam &&
          originalTeams.some(
            (team: string) =>
              team.toLowerCase().includes("chủ nhiệm") ||
              team.toLowerCase().includes("admin")
          )
        ) {
          setError(
            "Admin không thể rời khỏi ban quan trọng. Vui lòng liên hệ quản trị viên khác."
          );
          return;
        }
      }

      console.log("Saving member changes:", {
        userId,
        originalTeams,
        newTeams: teams,
        teamRoles,
        member,
      });

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

      console.log("Team changes:", {
        teamsToAdd,
        teamsToRemove,
        teamsToUpdate,
      });

      // Permission checks: ensure user can modify each target team
      const allTouchedTeams = Array.from(
        new Set([...teamsToAdd, ...teamsToUpdate])
      );
      for (const teamName of allTouchedTeams) {
        if (!canEditTeamByName(teamName)) {
          throw new Error(
            `Bạn không có quyền cập nhật ban "${teamName}". Chỉ Admin, Chủ nhiệm/Phó CN hoặc Chủ nhiệm của chính ban đó mới được phép.`
          );
        }
      }

      // Add user to new teams
      for (const teamName of teamsToAdd) {
        // Find team ID from available teams
        const team = availableTeams.find((t) => t.name === teamName);
        if (team) {
          const role = teamRoles[teamName] || "Thành viên";
          console.log(`Adding user to team ${teamName} with role ${role}:`, {
            teamId: team.id,
            userId,
            role,
          });
          await memberService.addUserToTeam(team.id, userId, role);
          console.log(`Successfully added user to team ${teamName}`);
        } else {
          console.warn(`Team not found in available teams: ${teamName}`);
        }
      }

      // Update roles for existing team memberships
      for (const teamName of teamsToUpdate) {
        // Find team ID from available teams
        const team = availableTeams.find((t) => t.name === teamName);
        if (team) {
          const newRole = teamRoles[teamName];
          console.log(`Updating user role in team ${teamName} to ${newRole}:`, {
            teamId: team.id,
            userId,
            newRole,
          });
          await memberService.addUserToTeam(team.id, userId, newRole);
          console.log(`Successfully updated user role in team ${teamName}`);
        } else {
          console.warn(`Team not found in available teams: ${teamName}`);
        }
      }

      // Remove user from teams
      for (const teamName of teamsToRemove) {
        // Find team ID from available teams
        const team = availableTeams.find((t) => t.name === teamName);
        if (team) {
          try {
            console.log(`Removing user from team ${teamName}:`, {
              teamId: team.id,
              userId,
            });
            await teamService.removeMemberFromTeam(team.id, userId);
            console.log(`Successfully removed user from team ${teamName}`);
          } catch (error) {
            console.error(
              `Failed to remove user from team ${teamName}:`,
              error
            );
            // Continue with other operations even if one removal fails
          }
        } else {
          console.warn(`Team not found in available teams: ${teamName}`);
        }
      }

      console.log("All team operations completed successfully");

      if (onSaved) {
        console.log("Calling onSaved callback");
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
        {isEditingSelf && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md text-sm">
            <strong>Lưu ý:</strong> Bạn đang chỉnh sửa hồ sơ của chính mình. Một
            số thay đổi có thể bị hạn chế để bảo vệ quyền admin.
          </div>
        )}
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
                {teamList.map((team) => {
                  const isProtectedForAdmin =
                    isEditingSelf &&
                    (team.toLowerCase().includes("chủ nhiệm") ||
                      team.toLowerCase().includes("admin"));

                  return (
                    <div
                      key={team}
                      className="flex items-center gap-2 text-sm opacity-100"
                    >
                      <input
                        type="checkbox"
                        checked={teams.includes(team)}
                        onChange={() => toggleTeam(team)}
                        disabled={
                          !canEditTeamByName(team) ||
                          (isEditingSelf &&
                            isProtectedForAdmin &&
                            !teams.includes(team))
                        }
                      />
                      <span
                        className={`min-w-[100px] ${
                          !canEditTeamByName(team) ? "text-gray-400" : ""
                        } ${
                          isProtectedForAdmin
                            ? "text-blue-600 font-semibold"
                            : ""
                        }`}
                      >
                        {team}
                        {isProtectedForAdmin && " (Bảo vệ)"}
                      </span>
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
                          disabled={!canEditTeamByName(team)}
                          style={{
                            backgroundColor: "var(--background)",
                            color: "var(--foreground)",
                            borderColor: "var(--sfit-gray-200)",
                          }}
                        >
                          <option value="Trưởng ban">Trưởng ban</option>
                          <option value="Phó ban">Phó ban</option>
                          <option value="Thành viên">Thành viên</option>
                        </select>
                      )}
                    </div>
                  );
                })}
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
