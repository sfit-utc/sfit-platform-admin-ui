"use client";

import { useState, useEffect } from "react";
import {
  useTeams,
  useTeamMembers,
  useUserTeams,
} from "@/hooks/use-team-service";
import { Team, TeamRole, TeamMember } from "@/types/team";
import { MemberListItem } from "@/types/member";
import { memberService } from "@/services/member-service";
import Loading from "@/components/ui/loading";
import { Plus, Eye, Edit, Trash2, UserMinus, UserCheck } from "lucide-react";

interface MemberManagementProps {
  member: MemberListItem;
  onMemberUpdated?: () => void;
}

export default function MemberManagement({
  member,
  onMemberUpdated,
}: MemberManagementProps) {
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [showAddToTeam, setShowAddToTeam] = useState(false);
  const [showEditRole, setShowEditRole] = useState(false);
  const [showDeleteFromTeam, setShowDeleteFromTeam] = useState(false);
  const [showDeleteMember, setShowDeleteMember] = useState(false);
  const [showViewDetails, setShowViewDetails] = useState(false);
  const [selectedRole, setSelectedRole] = useState<TeamRole>("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all teams for dropdowns
  const { teams, loading: teamsLoading } = useTeams();

  // Get user's current teams
  const { userTeams, loading: userTeamsLoading } = useUserTeams(
    member.userId || String(member.id)
  );

  // Get team members for the selected team
  const {
    members: teamMembers,
    updateMemberRole,
    removeMember,
  } = useTeamMembers(selectedTeam);

  // Available roles for teams
  const availableRoles: TeamRole[] = ["head", "vice", "member"];

  // Function 1: Add member to team
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

  // Function 2: View member information
  const handleViewDetails = () => {
    setShowViewDetails(true);
  };

  // Function 3: Edit member info (existing functionality)
  const handleEditMember = () => {
    // This would open the existing edit modal
    // Implementation depends on existing edit modal structure
  };

  // Function 4: Delete member from team
  const handleDeleteFromTeam = async () => {
    if (!selectedTeam || !member.userId) return;

    setLoading(true);
    setError(null);
    try {
      await removeMember(member.userId);
      setShowDeleteFromTeam(false);
      onMemberUpdated?.();
    } catch (err: any) {
      setError(err.message || "Failed to remove member from team");
    } finally {
      setLoading(false);
    }
  };

  // Function 5: Delete member completely
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

  // Function 6: Switch role in UI
  const handleSwitchRole = async () => {
    if (!selectedTeam || !member.userId) return;

    setLoading(true);
    setError(null);
    try {
      await updateMemberRole(member.userId, { role: selectedRole });
      setShowEditRole(false);
      onMemberUpdated?.();
    } catch (err: any) {
      setError(err.message || "Failed to update member role");
    } finally {
      setLoading(false);
    }
  };

  if (teamsLoading || userTeamsLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-4">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Member Info Display */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">{member.name}</h3>
        <p className="text-gray-600">Email: {member.email}</p>
        <p className="text-gray-600">Current Role: {member.role}</p>
        <p className="text-gray-600">
          Teams: {member.teams?.join(", ") || "None"}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {/* Add to Team */}
        <button
          onClick={() => setShowAddToTeam(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          disabled={loading}
        >
          <Plus className="w-4 h-4" />
          Add to Team
        </button>

        {/* View Details */}
        <button
          onClick={handleViewDetails}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>

        {/* Edit Member */}
        <button
          onClick={handleEditMember}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit Info
        </button>

        {/* Delete from Team */}
        <button
          onClick={() => setShowDeleteFromTeam(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          disabled={!userTeams.length}
        >
          <UserMinus className="w-4 h-4" />
          Remove from Team
        </button>

        {/* Switch Role */}
        <button
          onClick={() => setShowEditRole(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          disabled={!userTeams.length}
        >
          <UserCheck className="w-4 h-4" />
          Change Role
        </button>

        {/* Delete Member */}
        <button
          onClick={() => setShowDeleteMember(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete Member
        </button>
      </div>

      {/* Add to Team Modal */}
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
                  onChange={(e) => setSelectedRole(e.target.value as TeamRole)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {availableRoles.map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
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

      {/* Edit Role Modal */}
      {showEditRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Change Member Role</h3>

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
                  {userTeams.map((userTeam) => (
                    <option key={userTeam.team_id} value={userTeam.team_id}>
                      {userTeam.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  New Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as TeamRole)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {availableRoles.map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSwitchRole}
                disabled={!selectedTeam || loading}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Role"}
              </button>
              <button
                onClick={() => setShowEditRole(false)}
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
              Delete Member
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to permanently delete {member.name}? This
              action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteMember}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete Member"}
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

      {/* View Details Modal */}
      {showViewDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Member Details</h3>

            <div className="space-y-3">
              <div>
                <span className="font-medium">Name:</span> {member.name}
              </div>
              <div>
                <span className="font-medium">Email:</span> {member.email}
              </div>
              <div>
                <span className="font-medium">Role:</span> {member.role}
              </div>
              <div>
                <span className="font-medium">Teams:</span>
                <ul className="list-disc list-inside ml-2">
                  {userTeams.map((userTeam) => (
                    <li key={userTeam.team_id}>
                      {userTeam.name} - {userTeam.role.join(", ")}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowViewDetails(false)}
                className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
