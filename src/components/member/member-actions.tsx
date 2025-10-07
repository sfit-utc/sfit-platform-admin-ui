"use client";

import { useState } from "react";
import { MemberListItem } from "@/types/member";
import { useTeams, useUserTeams } from "@/hooks/use-team-service";
import { TeamRole } from "@/types/team";
import { memberService } from "@/services/member-service";
import { Plus, UserMinus, UserCheck, Trash2 } from "lucide-react";

interface MemberActionsProps {
  member: MemberListItem;
  onMemberUpdated?: () => void;
  compact?: boolean;
}

export default function MemberActions({
  member,
  onMemberUpdated,
  compact = false,
}: MemberActionsProps) {
  const [showAddToTeam, setShowAddToTeam] = useState(false);
  // const [showEditRole, setShowEditRole] = useState(false);
  const [showDeleteFromTeam, setShowDeleteFromTeam] = useState(false);
  const [showDeleteMember, setShowDeleteMember] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<TeamRole>("MEMBER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { teams} = useTeams();
  const { userTeams} = useUserTeams(
    member.userId || String(member.id)
  );

  const availableRoles: TeamRole[] = ["HEADER", "VICE", "MEMBER"];
  const canEditTeam = (teamId: string) => {
    const team = userTeams.find((t) => t.team_id === teamId);
    if (!team) return false;
    const roles = Array.isArray(team.role) ? team.role : [team.role];
    const upperRoles = roles.map((r: any) => String(r).toUpperCase());
    return upperRoles.includes("HEADER");
  };

  const handleAddToTeam = async () => {
    if (!selectedTeam || !member.userId) return;

    setLoading(true);
    setError(null);
    try {
      await memberService.addMemberToTeam(selectedTeam, member.userId, {
        role: selectedRole,
      });
      setShowAddToTeam(false);
      onMemberUpdated?.();
    } catch (err: any) {
      setError(err.message || "Failed to add member to team");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFromTeam = async () => {
    if (!selectedTeam || !member.userId) return;

    setLoading(true);
    setError(null);
    try {
      // This would use the team service to remove member
      setShowDeleteFromTeam(false);
      onMemberUpdated?.();
    } catch (err: any) {
      setError(err.message || "Failed to remove member from team");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!member.userId) return;

    setLoading(true);
    setError(null);
    try {
      await memberService.deleteMember(member.userId);
      setShowDeleteMember(false);
      onMemberUpdated?.();
    } catch (err: any) {
      setError(err.message || "Failed to delete member");
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <div className="flex gap-2">
        {/* Add to Team */}
        <button
          onClick={() => setShowAddToTeam(true)}
          className="p-2 text-green-600 hover:bg-green-50 rounded-md"
          title="Add to Team"
          disabled={loading}
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Remove from Team */}
        <button
          onClick={() => setShowDeleteFromTeam(true)}
          className="p-2 text-orange-600 hover:bg-orange-50 rounded-md"
          title="Remove from Team"
          disabled={!userTeams.length || loading}
        >
          <UserMinus className="w-4 h-4" />
        </button>

        {/* Change Role */}
        <button
          // onClick={() => setShowEditRole(true)}
          className="p-2 text-purple-600 hover:bg-purple-50 rounded-md"
          title="Change Role"
          disabled={
            !userTeams.length ||
            loading ||
            (!!selectedTeam && !canEditTeam(selectedTeam))
          }
        >
          <UserCheck className="w-4 h-4" />
        </button>

        {/* Clear roles & teams */}
        <button
          onClick={() => setShowDeleteMember(true)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-md"
          title="Clear roles & teams"
          disabled={loading}
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Modals */}
        {showAddToTeam && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Add Member to Team</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select Team
                  </label>
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Choose a team...</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) =>
                      setSelectedRole(e.target.value as TeamRole)
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddToTeam}
                  disabled={!selectedTeam || loading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add to Team"}
                </button>
                <button
                  onClick={() => setShowAddToTeam(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete from Team Modal */}
        {showDeleteFromTeam && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Remove from Team</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to remove {member.name} from the selected
                team?
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Select Team
                </label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Choose a team...</option>
                  {userTeams.map((userTeam) => (
                    <option key={userTeam.team_id} value={userTeam.team_id}>
                      {userTeam.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteFromTeam}
                  disabled={!selectedTeam || loading}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
                >
                  {loading ? "Removing..." : "Remove from Team"}
                </button>
                <button
                  onClick={() => setShowDeleteFromTeam(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Member Modal */}
        {showDeleteMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-semibold mb-4 text-red-600">
                Clear member&apos;s roles & teams
              </h3>
              <p className="text-gray-600 mb-4">
                This will remove {member.name} from all teams and clear roles.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteMember}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? "Clearing..." : "Clear"}
                </button>
                <button
                  onClick={() => setShowDeleteMember(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm z-50">
            {error}
          </div>
        )}
      </div>
    );
  }

  // Full view implementation would go here
  return null;
}
