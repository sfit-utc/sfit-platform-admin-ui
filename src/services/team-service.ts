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

class TeamService {
  /**
   * Tạo ban mới
   * @param teamData - Dữ liệu ban cần tạo
   * @returns Promise<CreateTeamResponse> - Kết quả tạo ban
   */
  async createTeam(teamData: CreateTeamRequest): Promise<CreateTeamResponse> {
    try {
      const response = await apiClient.post<any>('/teams', teamData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating team:', error);
      throw new Error('Failed to create team');
    }
  }

  /**
   * Chỉnh sửa thông tin ban
   * @param teamData - Dữ liệu ban cần cập nhật
   * @returns Promise<UpdateTeamResponse> - Kết quả cập nhật ban
   */
  async updateTeam(teamData: UpdateTeamRequest): Promise<UpdateTeamResponse> {
    try {
      const response = await apiClient.put<any>('/teams', teamData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating team:', error);
      throw new Error('Failed to update team');
    }
  }

  /**
   * Xóa ban
   * @param teamId - ID của ban cần xóa
   * @returns Promise<void>
   */
  async deleteTeam(teamId: string): Promise<void> {
    try {
      await apiClient.delete(`/teams/${teamId}`);
    } catch (error) {
      console.error('Error deleting team:', error);
      throw new Error('Failed to delete team');
    }
  }

  /**
   * Lấy danh sách tất cả ban
   * @returns Promise<Team[]> - Danh sách các ban
   */
  async getAllTeams(): Promise<Team[]> {
    try {
      const response = await apiClient.get<any>('/teams');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw new Error('Failed to fetch teams');
    }
  }

  /**
   * Lấy danh sách thành viên trong ban
   * @param teamId - ID của ban
   * @param query - Tham số phân trang
   * @returns Promise<TeamMembersResponse> - Danh sách thành viên
   */
  async getTeamMembers(teamId: string, query?: TeamMembersQuery): Promise<TeamMembersResponse> {
    try {
      const params = new URLSearchParams();
      if (query?.page) params.append('page', query.page.toString());
      if (query?.pageSize) params.append('pageSize', query.pageSize.toString());
      
      const url = `/teams/${teamId}/users${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiClient.get<any>(url);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw new Error('Failed to fetch team members');
    }
  }

  /**
   * Lấy các ban của một người dùng
   * @param userId - ID của người dùng
   * @returns Promise<UserTeamsResponse[]> - Danh sách ban của người dùng
   */
  async getUserTeams(userId: string): Promise<UserTeamsResponse[]> {
    try {
      const response = await apiClient.get<any>(`/users/${userId}/teams`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching user teams:', error);
      throw new Error('Failed to fetch user teams');
    }
  }

  /**
   * Thêm một người vào ban đã tồn tại
   * @param teamId - ID của ban
   * @param userId - ID của người dùng
   * @param memberData - Dữ liệu thành viên (vai trò)
   * @returns Promise<AddMemberToTeamResponse> - Kết quả thêm thành viên
   */
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

  /**
   * Xóa 1 người khỏi ban
   * @param teamId - ID của ban
   * @param userId - ID của người dùng
   * @returns Promise<void>
   */
  async removeMemberFromTeam(teamId: string, userId: string): Promise<void> {
    try {
      await apiClient.delete(`/teams/${teamId}/users/${userId}`);
    } catch (error) {
      console.error('Error removing member from team:', error);
      throw new Error('Failed to remove member from team');
    }
  }

  /**
   * Cập nhật vai trò người dùng trong ban
   * @param teamId - ID của ban
   * @param userId - ID của người dùng
   * @param roleData - Dữ liệu vai trò mới
   * @returns Promise<UpdateMemberRoleResponse> - Kết quả cập nhật vai trò
   */
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