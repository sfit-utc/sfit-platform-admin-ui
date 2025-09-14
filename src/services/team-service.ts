import apiClient from '@/libs/http';
import {
  Team,
  CreateTeamRequest,
  CreateTeamResponse,
  UpdateTeamRequest,
  UpdateTeamResponse,
  AddMemberToTeamRequest,
  AddMemberToTeamResponse,
  UpdateMemberRoleRequest,
  UpdateMemberRoleResponse,
  TeamMembersResponse,
  UserTeamsResponse,
  TeamMembersQuery,
  TeamApiError
} from '@/types/team';

function extractItems(respData: any): any[] {
  if (respData && typeof respData === "object") {
    if (Array.isArray(respData.items)) return respData.items;
    if (respData.data && Array.isArray(respData.data.items)) return respData.data.items;
    if (Array.isArray(respData.data)) return respData.data;
  }
  return Array.isArray(respData) ? respData : [];
}

class TeamService {
  async createTeam(teamData: CreateTeamRequest): Promise<CreateTeamResponse> {
    try {
      const response = await apiClient.post<any>('/teams', teamData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating team:', error);
      throw new Error('Failed to create team');
    }
  }

  async updateTeam(teamData: UpdateTeamRequest): Promise<UpdateTeamResponse> {
    try {
      const response = await apiClient.put<any>('/teams', teamData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating team:', error);
      throw new Error('Failed to update team');
    }
  }

  async deleteTeam(teamId: string): Promise<void> {
    try {
      await apiClient.delete(`/teams/${teamId}`);
    } catch (error) {
      console.error('Error deleting team:', error);
      throw new Error('Failed to delete team');
    }
  }

  async getAllTeams(): Promise<Team[]> {
    try {
      const response = await apiClient.get<any>('/teams');
      const teams = extractItems(response.data);
      
      return teams.map((team: any) => ({
        id: team.ID,
        name: team.Name,
        description: team.Description || "Không có mô tả",
        createdAt: team.CreatedAt || new Date().toISOString(),
        updatedAt: team.UpdatedAt || new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw new Error('Failed to fetch teams');
    }
  }


  async getTeamMembers(teamId: string, query?: TeamMembersQuery): Promise<TeamMembersResponse> {
    try {
      const params = new URLSearchParams();
      if (query?.page) params.append('page', query.page.toString());
      if (query?.pageSize) params.append('page_size', query.pageSize.toString());
      
      const url = `/teams/${teamId}/users${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiClient.get<any>(url);
      
      const users = extractItems(response.data);
      
      return {
        users: users.map((user: any) => ({
          id: user.ID || user.id,
          username: user.Username || user.username || user.Name || user.name,
          email: user.Email || user.email || '',
          role: user.Role || user.role || 'member',
        })),
        page: query?.page || 1,
        pageSize: query?.pageSize || 10,
        total: response.data.total || response.data.totalCount || users.length,
      };
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw new Error('Failed to fetch team members');
    }
  }

  async getUserTeams(userId: string): Promise<UserTeamsResponse[]> {
    try {
      const response = await apiClient.get<any>(`/users/${userId}/teams`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching user teams:', error);
      throw new Error('Failed to fetch user teams');
    }
  }

  async addMemberToTeam(
    teamId: string, 
    userId: string, 
    memberData: AddMemberToTeamRequest
  ): Promise<AddMemberToTeamResponse> {
    try {
      const response = await apiClient.put<any>(`/teams/${teamId}/users/${userId}`, memberData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error adding member to team:', error);
      throw new Error('Failed to add member to team');
    }
  }

  async removeMemberFromTeam(teamId: string, userId: string): Promise<void> {
    try {
      await apiClient.delete(`/teams/${teamId}/users/${userId}`);
    } catch (error) {
      console.error('Error removing member from team:', error);
      throw new Error('Failed to remove member from team');
    }
  }

  async updateMemberRole(
    teamId: string, 
    userId: string, 
    roleData: UpdateMemberRoleRequest
  ): Promise<UpdateMemberRoleResponse> {
    try {
      const response = await apiClient.put<any>(`/team/${teamId}/users/${userId}`, roleData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating member role:', error);
      throw new Error('Failed to update member role');
    }
  }
}

export const teamService = new TeamService();