import { Member, MemberStats, MemberListItem, MemberFilters, ApiError } from "@/types/member";
import apiClient from '@/libs/http';

class MemberService {
  async getMemberStats(): Promise<MemberStats> {
    try {
      // Get current user's teams instead of all teams (requires admin privileges)
      const currentUser = this.getCurrentUserId();
      console.log('Current user ID:', currentUser);
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Check if token exists
      const token = localStorage.getItem('accessToken');
      console.log('Token exists:', !!token);
      console.log('Token preview:', token ? `${token.substring(0, 20)}...` : 'No token');
      
      const teamsResponse = await apiClient.get(`/users/${currentUser}/teams`);
      console.log('Full teams response:', teamsResponse);
      console.log('Teams response.data:', teamsResponse.data);
      console.log('Teams response.data type:', typeof teamsResponse.data);
      console.log('Teams response.data is array:', Array.isArray(teamsResponse.data));
      
      // Handle different response formats
      let teams = teamsResponse.data;
      if (teamsResponse.data && typeof teamsResponse.data === 'object' && teamsResponse.data.data) {
        // Backend might wrap data in a data field
        teams = teamsResponse.data.data;
        console.log('Extracted teams from data.data:', teams);
      }
      
      if (!Array.isArray(teams)) {
        console.error('Teams is not an array:', teams);
        throw new Error('Invalid response format: teams is not an array');
      }
      
      let totalMembers = 0;
      let activeMembers = 0;
      let leaders = 0;
      
      // Count members from user's teams
      for (const team of teams) {
        try {
          console.log('Processing team:', team);
          const membersResponse = await apiClient.get(`/teams/${team.id}/users`);
          const teamMembers = membersResponse.data;
          totalMembers += teamMembers.length;
          
          teamMembers.forEach((member: any) => {
            if (member.status === 'active') activeMembers++;
            if (member.role === 'ADMIN' || member.role === 'HEAD' || member.role === 'VICE') leaders++;
          });
        } catch (error) {
          console.warn(`Failed to get members for team ${team.id}:`, error);
        }
      }
      
      return {
        totalMembers,
        activeMembers,
        leaders,
        newMembers: 0, 
      };
    } catch (error: any) {
      console.error("get member stats error: ", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        console.error("Response headers:", error.response.headers);
      }
      throw error;
    }
  }

  async getMembers(filters?: MemberFilters): Promise<MemberListItem[]> {
    try {
      // Get current user's teams instead of all teams
      const currentUser = this.getCurrentUserId();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      const teamsResponse = await apiClient.get(`/users/${currentUser}/teams`);
      console.log('getMembers - Teams response:', teamsResponse);
      
      // Handle different response formats
      let teams = teamsResponse.data;
      if (teamsResponse.data && typeof teamsResponse.data === 'object' && teamsResponse.data.data) {
        // Backend might wrap data in a data field
        teams = teamsResponse.data.data;
        console.log('getMembers - Extracted teams from data.data:', teams);
      }
      
      if (!Array.isArray(teams)) {
        console.error('getMembers - Teams is not an array:', teams);
        return []; // Return empty array if no teams
      }
      
      let allMembers: MemberListItem[] = [];
      
      // Collect members from user's teams
      for (const team of teams) {
        try {
          const membersResponse = await apiClient.get(`/teams/${team.id}/users`);
          const teamMembers = membersResponse.data;
          
          // Transform team members to MemberListItem format
          const transformedMembers = teamMembers.map((member: any) => ({
            id: member.user_id || member.id,
            name: member.full_name || member.name || 'Unknown',
            role: member.role || 'Thành viên',
            class: member.class_name || 'Chưa phân lớp',
            teams: [team.name || 'Unknown Team'],
            avatar: member.avatar || '/avatars/default.jpg',
            lastActive: member.last_active || 'Unknown',
            email: member.email,
            status: member.status || 'active',
          }));
          
          allMembers = [...allMembers, ...transformedMembers];
        } catch (error) {
          console.warn(`Failed to get members for team ${team.id}:`, error);
        }
      }
      
      // Apply filters if provided
      if (filters) {
        if (filters.role) {
          allMembers = allMembers.filter(member => 
            member.role.toLowerCase().includes(filters.role!.toLowerCase())
          );
        }
        if (filters.class) {
          allMembers = allMembers.filter(member => 
            member.class.toLowerCase().includes(filters.class!.toLowerCase())
          );
        }
        if (filters.team) {
          allMembers = allMembers.filter(member => 
            member.teams.some(team => 
              team.toLowerCase().includes(filters.team!.toLowerCase())
            )
          );
        }
        if (filters.status) {
          allMembers = allMembers.filter(member => 
            member.status === filters.status
          );
        }
        if (filters.search) {
          const normalizedSearch = filters.search.toLowerCase();
          allMembers = allMembers.filter(member => 
            member.name.toLowerCase().includes(normalizedSearch) ||
            member.role.toLowerCase().includes(normalizedSearch) ||
            member.teams.some(team => team.toLowerCase().includes(normalizedSearch)) ||
            member.class.toLowerCase().includes(normalizedSearch)
          );
        }
      }
      
      return allMembers;
    } catch (error) {
      console.error("get members error: ", error);
      throw error;
    }
  }

  async getMemberById(id: number): Promise<Member> {
    try {
      
      const profileResponse = await apiClient.get(`/user-profiles/${id}`);
      const profile = profileResponse.data;
      
      
      const teamsResponse = await apiClient.get(`/users/${id}/teams`);
      const teams = teamsResponse.data;
      
      return {
        id: id,
        name: profile.full_name || 'Unknown',
        teams: teams.map((team: any) => team.name || 'Chưa có ban'),
        role: profile.role || 'Thành viên',
        class: profile.class_name || 'Chưa phân lớp',
        email: profile.email || '',
        avatar: profile.avatar || '/avatars/default.jpg',
        status: profile.status || 'active',
        joinDate: profile.created_at || new Date().toISOString(),
      };
    } catch (error) {
      console.error("get member by id error: ", error);
      throw error;
    }
  }

  async createMember(data: Omit<Member, 'id'>): Promise<Member> {
    try {
      // Create user profile first
      const profileData = {
        full_name: data.name,
        email: data.email,
        class_name: data.class,
        role: data.role,
        status: data.status,
      };
      
      const profileResponse = await apiClient.post('/user-profiles', profileData);
      const newProfile = profileResponse.data;
      
      
      if (data.teams && data.teams.length > 0) {
        try {
          await apiClient.put(`/teams/${data.teams[0]}/users/${newProfile.id}`, {
            role: data.role || 'MEMBER'
          });
        } catch (error) {
          console.warn('Failed to add user to team:', error);
        }
      }
      
      return {
        ...data,
        id: newProfile.id,
      };
    } catch (error) {
      console.error("create member error: ", error);
      throw error;
    }
  }

  async updateMember(id: number, data: Partial<Member>): Promise<Member> {
    try {
      // Update user profile
      const profileData: any = {};
      
      if (data.name) profileData.full_name = data.name;
      if (data.email) profileData.email = data.email;
      if (data.class) profileData.class_name = data.class;
      if (data.role) profileData.role = data.role;
      if (data.status) profileData.status = data.status;
      
      const response = await apiClient.put('/user-profiles', profileData);
      return response.data;
    } catch (error) {
      console.error("update member error: ", error);
      throw error;
    }
  }

  async deleteMember(id: number): Promise<void> {
    try {
      // Remove from all teams first
      const teamsResponse = await apiClient.get(`/users/${id}/teams`);
      const teams = teamsResponse.data;
      
      for (const team of teams) {
        try {
          await apiClient.delete(`/teams/${team.id}/users/${id}`);
        } catch (error) {
          console.warn(`Failed to remove user from team ${team.id}:`, error);
        }
      }
      
      // Delete user profile
      await apiClient.delete(`/user-profiles/${id}`);
    } catch (error) {
      console.error("delete member error: ", error);
      throw error;
    }
  }

  
  async getTeamMembers(teamId: string): Promise<MemberListItem[]> {
    try {
      const response = await apiClient.get(`/teams/${teamId}/users`);
      const members = response.data;
      
      return members.map((member: any) => ({
        id: member.user_id || member.id,
        name: member.full_name || member.name || 'Unknown',
        role: member.role || 'Thành viên',
        class: member.class_name || 'Chưa phân lớp',
        teams: [member.team_name || 'Unknown Team'],
        avatar: member.avatar || '/avatars/default.jpg',
        lastActive: member.last_active || 'Unknown',
        email: member.email,
        status: member.status || 'active',
      }));
    } catch (error) {
      console.error("get team members error: ", error);
      throw error;
    }
  }

  async addMemberToTeam(teamId: string, userId: string, role: string = 'MEMBER'): Promise<void> {
    try {
      await apiClient.put(`/teams/${teamId}/users/${userId}`, { role });
    } catch (error) {
      console.error("add member to team error: ", error);
      throw error;
    }
  }

  async removeMemberFromTeam(teamId: string, userId: string): Promise<void> {
    try {
      await apiClient.delete(`/teams/${teamId}/users/${userId}`);
    } catch (error) {
      console.error("remove member from team error: ", error);
      throw error;
    }
  }

  async updateMemberRole(teamId: string, userId: string, newRole: string): Promise<void> {
    try {
      await apiClient.put(`/teams/${teamId}/users/${userId}`, { role: newRole });
    } catch (error) {
      console.error("update member role error: ", error);
      throw error;
    }
  }

  // Helper method to get current user ID from JWT token
  private getCurrentUserId(): string | null {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;
      
      const [, payload] = token.split('.');
      const json = JSON.parse(atob(payload));
      return json.sub || json.user_id || null;
    } catch {
      return null;
    }
  }
}

export const memberService = new MemberService();