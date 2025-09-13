import { useState, useEffect } from "react";
import { teamService } from "@/services/team-service";
import {
  Team,
  TeamMembersResponse,
  UserTeamsResponse,
  CreateTeamRequest,
  UpdateTeamRequest,
  AddMemberToTeamRequest,
  UpdateMemberRoleRequest,
  TeamMembersQuery,
} from "@/types/team";

// Hook for managing teams
export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await teamService.getAllTeams();
      setTeams(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch teams");
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (teamData: CreateTeamRequest) => {
    setLoading(true);
    setError(null);
    try {
      await teamService.createTeam(teamData);
      await fetchTeams(); // Refresh the list
    } catch (err: any) {
      setError(err.message || "Failed to create team");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTeam = async (teamData: UpdateTeamRequest) => {
    setLoading(true);
    setError(null);
    try {
      await teamService.updateTeam(teamData);
      await fetchTeams(); // Refresh the list
    } catch (err: any) {
      setError(err.message || "Failed to update team");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTeam = async (teamId: string) => {
    setLoading(true);
    setError(null);
    try {
      await teamService.deleteTeam(teamId);
      await fetchTeams(); // Refresh the list
    } catch (err: any) {
      setError(err.message || "Failed to delete team");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return {
    teams,
    loading,
    error,
    refetch: fetchTeams,
    createTeam,
    updateTeam,
    deleteTeam,
  };
};

// Hook for managing team members
export const useTeamMembers = (teamId: string, query?: TeamMembersQuery) => {
  const [members, setMembers] = useState<TeamMembersResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    if (!teamId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await teamService.getTeamMembers(teamId, query);
      setMembers(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (
    userId: string,
    memberData: AddMemberToTeamRequest
  ) => {
    setLoading(true);
    setError(null);
    try {
      await teamService.addMemberToTeam(teamId, userId, memberData);
      await fetchMembers(); // Refresh the list
    } catch (err: any) {
      setError(err.message || "Failed to add member");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await teamService.removeMemberFromTeam(teamId, userId);
      await fetchMembers(); // Refresh the list
    } catch (err: any) {
      setError(err.message || "Failed to remove member");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMemberRole = async (
    userId: string,
    roleData: UpdateMemberRoleRequest
  ) => {
    setLoading(true);
    setError(null);
    try {
      await teamService.updateMemberRole(teamId, userId, roleData);
      await fetchMembers(); // Refresh the list
    } catch (err: any) {
      setError(err.message || "Failed to update member role");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [teamId, query?.page, query?.pageSize]);

  return {
    members,
    loading,
    error,
    refetch: fetchMembers,
    addMember,
    removeMember,
    updateMemberRole,
  };
};

// Hook for managing user teams
export const useUserTeams = (userId: string) => {
  const [userTeams, setUserTeams] = useState<UserTeamsResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserTeams = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await teamService.getUserTeams(userId);
      setUserTeams(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch user teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTeams();
  }, [userId]);

  return {
    userTeams,
    loading,
    error,
    refetch: fetchUserTeams,
  };
};
