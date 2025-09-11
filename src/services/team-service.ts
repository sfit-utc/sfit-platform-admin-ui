import apiClient from "@/libs/http";
import { Team, CreateTeamRequest, CreateTeamResponse } from "@/types/team";

class TeamService {
  async getAllTeams(): Promise<Team[]> {
    try {
      const response = await apiClient.get("/teams");
      const raw = response.data?.data || response.data;
      return (Array.isArray(raw) ? raw : []).map((t: any) => ({
        id: t.id || t.ID || t.team_id || t.TeamID,
        name: t.name || t.Name,
        description: t.description || t.Description || "",
        created_at: t.created_at || t.create_at || t.CreatedAt || t.CreateAt || "",
        updated_at: t.updated_at || t.UpdatedAt || "",
      }));
    } catch (error) {
      console.error("Error fetching teams:", error);
      throw error;
    }
  }

  async createTeam(data: CreateTeamRequest): Promise<CreateTeamResponse> {
    try {
      const response = await apiClient.post("/teams", data);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error creating team:", error);
      throw error;
    }
  }

  async updateTeam(teamId: string, data: CreateTeamRequest): Promise<void> {
    try {
      await apiClient.put(`/teams/${teamId}`, data);
    } catch (error) {
      console.error("Error updating team:", error);
      throw error;
    }
  }

  async deleteTeam(teamId: string): Promise<void> {
    try {
      await apiClient.delete(`/teams/${teamId}`);
    } catch (error) {
      console.error("Error deleting team:", error);
      throw error;
    }
  }

  // Get teams that a specific user has joined
  async getUserTeams(userId: string): Promise<Team[]> {
    try {
      const url = `/users/${userId}/teams`;
      const response = await apiClient.get(url);
      const raw = response.data?.data || response.data;
      // Normalize shape to Team[]
      return (Array.isArray(raw) ? raw : []).map((t: any) => ({
        id: t.id || t.team_id,
        name: t.name,
        description: t.description || "",
        created_at: t.created_at || t.create_at || "",
        updated_at: t.updated_at || "",
      }));
    } catch (error) {
      console.error("Error fetching user teams:", error);
      throw error;
    }
  }

  // Get team members with pagination
  async getTeamMembers(teamId: string, page: number = 1, pageSize: number = 10): Promise<any> {
    try {
      const response = await apiClient.get(`/teams/${teamId}/users?page=${page}&pageSize=${pageSize}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching team members:", error);
      throw error;
    }
  }

  // Add member to team
  async addMemberToTeam(teamId: string, userId: string, role: string): Promise<void> {
    try {
      await apiClient.put(`/teams/${teamId}/users/${userId}`, { role });
    } catch (error) {
      console.error("Error adding member to team:", error);
      throw error;
    }
  }

  // Remove member from team
  async removeMemberFromTeam(teamId: string, userId: string): Promise<void> {
    try {
      await apiClient.delete(`/teams/${teamId}/users/${userId}`);
    } catch (error) {
      console.error("Error removing member from team:", error);
      throw error;
    }
  }

  // Update member role in team
  async updateMemberRole(teamId: string, userId: string, role: string): Promise<void> {
    try {
      await apiClient.put(`/teams/${teamId}/users/${userId}`, { role });
    } catch (error) {
      console.error("Error updating member role:", error);
      throw error;
    }
  }
}

export const teamService = new TeamService();
