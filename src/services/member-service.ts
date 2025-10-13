import { Member, MemberStats, MemberListItem, MemberFilters} from "@/types/member";
import apiClient from '@/libs/http';
import { teamService } from "./team-service";
import {  AddMemberToTeamRequest } from "@/types/team";

class MemberService {
  async getMemberStats(): Promise<MemberStats> {
    try {
      // Get basic user count first without fetching profiles to avoid 500 errors
      const params = new URLSearchParams();
      params.append('page', '1');
      params.append('page_size', '1000');
      
      const url = `/users?${params.toString()}`;
      const response = await apiClient.get<any>(url);
      const users = response.data.data?.items || [];
      
      // Calculate basic statistics from user data
      const totalMembers = users.length;
      
      // For now, return basic stats without detailed profile fetching
      // This avoids the 500 error from user-profiles endpoint
      return {
        totalMembers,
        activeMembers: totalMembers, // Assume all are active
        leaders: 0, // Will be calculated when profiles are available
        newMembers: Math.floor(totalMembers * 0.1) // Estimate 10% are new
      };
    } catch (error) {
      console.error('Error fetching member stats:', error);
      // Return default stats if API fails
      return {
        totalMembers: 0,
        activeMembers: 0,
        leaders: 0,
        newMembers: 0
      };
    }
  }

  /**
   * Get all members with filters and pagination
   * @param filters - Optional filters for members
   * @param page - Page number (default: 1)
   * @param pageSize - Number of items per page (default: 10)
   * @returns Promise<{members: MemberListItem[], total: number, page: number, pageSize: number}> - Paginated members
   */
  async getMembers(filters?: MemberFilters, page: number = 1, pageSize: number = 10): Promise<{
    members: MemberListItem[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    try {
      const params = new URLSearchParams();
      params.append('page', '1');
      params.append('page_size', '500'); // Get a large batch to search through
      
      const url = `/users?${params.toString()}`;
      const response = await apiClient.get<any>(url);
      const data = response.data.data;
      
      // Step 2: For each user, get their profile information with better error handling
      const allMembers = await Promise.all(
        data.items.map(async (user: any, index: number) => {
          try {
            // Try to get user profile, but don't fail if it doesn't exist
            let profile = null;
            try {
              const profileResponse = await apiClient.get<any>(`/user-profiles/${user.id}`);
              profile = profileResponse.data.data || profileResponse.data;
            } catch (profileError) {
              console.warn(`Profile not found for user ${user.id}, using basic info`);
              // Continue with basic user data
            }
            
            // Try to get user teams, but don't fail if it doesn't exist
            let teams = [];
            try {
              const teamsResponse = await apiClient.get<any>(`/users/${user.id}/teams`);
              teams = teamsResponse.data.data || teamsResponse.data || [];
            } catch (teamsError) {
              console.warn(`Teams not found for user ${user.id}`);
              // Continue with empty teams
            }
            
            return {
              id: index + 1, // Sequential index starting from 1
              userId: user.id,
              name: profile?.full_name || user.full_name || user.username || 'Unknown',
              email: profile?.email || user.email || '',
              class: profile?.class || user.class || '',
              role: this.getPrimaryRole(teams),
              teams: teams.map((team: any) => team.name),
              teamRoles: teams.reduce((acc: Record<string, string>, team: any) => {
                acc[team.name] = this.mapRoleFromBackend(team.role);
                return acc;
              }, {})
            };
          } catch (error) {
            console.error(`Error processing user ${user.id}:`, error);
            // Return basic info if everything fails
            return {
              id: index + 1, // Sequential index starting from 1
              userId: user.id,
              name: user.full_name || user.username || 'Unknown',
              email: user.email || '',
              class: user.class || '',
              role: 'Thành viên',
              teams: [],
              teamRoles: {}
            };
          }
        })
      );
      
      // Step 3: Apply client-side filtering (including search)
      let filteredMembers = allMembers;
      
      // Apply search filter
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase().trim();
        filteredMembers = filteredMembers.filter(member => 
          member.name.toLowerCase().includes(searchTerm) ||
          member.email.toLowerCase().includes(searchTerm) ||
          member.class.toLowerCase().includes(searchTerm) ||
          member.teams.some((team: string) => team.toLowerCase().includes(searchTerm)) ||
          member.role.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply role filter
      if (filters?.role && filters.role !== 'all') {
        filteredMembers = filteredMembers.filter(member => 
          member.role === filters.role
        );
      }
      
      if (filters?.team && filters.team !== 'all') {
        filteredMembers = filteredMembers.filter(member => 
          member.teams.includes(filters.team!)
        );
      }
      
      // Step 4: Apply pagination to filtered results
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedMembers = filteredMembers.slice(startIndex, endIndex);
      
      // Update IDs for pagination
      const membersWithCorrectIds = paginatedMembers.map((member, index) => ({
        ...member,
        id: startIndex + index + 1
      }));
      
      return {
        members: membersWithCorrectIds,
        total: filteredMembers.length,
        page: page,
        pageSize: pageSize
      };
    } catch (error) {
      console.error('Error fetching members:', error);
      throw new Error('Failed to fetch members');
    }
  }
  /**
   * Add member to team
   * @param teamId - ID of the team
   * @param userId - ID of the user
   * @param memberData - Member data including role
   */
  async addMemberToTeam(teamId: string, userId: string, memberData: AddMemberToTeamRequest): Promise<void> {
    try {
      await teamService.addMemberToTeam(teamId, userId, memberData);
    } catch (error) {
      console.error('Error adding member to team:', error);
      throw error;
    }
  }

  /**
   * Map Vietnamese role names to English backend role values
   * @param vietnameseRole - Vietnamese role name
   * @returns English role value expected by backend
   */
  private mapRoleToBackend(vietnameseRole: string): string {
    const roleMap: Record<string, string> = {
      'Trưởng ban': 'HEADER',
      'Phó ban': 'VICE',
      'Thành viên': 'MEMBER'
    };
    return roleMap[vietnameseRole] || 'MEMBER';
  }

  /**
   * Map English backend role values to Vietnamese role names
   * @param backendRole - English role value from backend
   * @returns Vietnamese role name for display
   */
  private mapRoleFromBackend(backendRole: string): string {
    const roleMap: Record<string, string> = {
      'HEADER': 'Trưởng ban',
      'VICE': 'Phó ban',
      'MEMBER': 'Thành viên'
    };
    return roleMap[backendRole] || 'Thành viên';
  }

  /**
   * Add user to team with role
   * @param teamId - ID of the team
   * @param userId - ID of the user
   * @param role - Role in the team (Vietnamese name)
   */
  async addUserToTeam(teamId: string, userId: string, role: string): Promise<any> {
    try {
      // Map Vietnamese role to English backend role
      const backendRole = this.mapRoleToBackend(role);
      
      const response = await apiClient.put(`/teams/${teamId}/users/${userId}`, {
        role: backendRole
      });
      return response.data;
    } catch (error: any) {
      console.error('Error adding user to team:', error);
      
      // Handle specific error cases
      if (error.response?.status === 409) {
        throw new Error('User is already a member of this team');
      } else if (error.response?.status === 404) {
        throw new Error('Team or user not found');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid role or request data');
      } else if (error.response?.status === 500) {
        throw new Error('Server error - please try again later');
      }
      
      throw new Error('Failed to add user to team');
    }
  }

  /**
   * Remove member from all teams (Delete button functionality)
   * @param userId - ID of the user to remove from teams
   */
  async deleteMember(userId: string): Promise<void> {
    try {
      // First, get all teams the user belongs to
      const teamsResponse = await apiClient.get<any>(`/users/${userId}/teams`);
      const teams = teamsResponse.data.data || teamsResponse.data;

      // Remove user from each team using the correct team ID field
      for (const team of teams) {
        // Use team.team_id or team.ID depending on API response structure
        const teamId = team.team_id || team.ID || team.id;
        if (teamId) {
          await teamService.removeMemberFromTeam(teamId, userId);
        }
      }
    } catch (error) {
      console.error('Error removing member from teams:', error);
      throw new Error('Failed to remove member from teams');
    }
  }

  /**
   * Get team member role
   * @param teamName - Name of the team
   * @param userId - ID of the user
   */
  async getTeamMemberRole(teamName: string, userId: string): Promise<string> {
    try {
      // Get user teams with roles
      const teamsResponse = await apiClient.get<any>(`/users/${userId}/teams`);
      const teams = teamsResponse.data.data || teamsResponse.data;
      
      // Find the specific team and return its role
      const team = teams.find((t: any) => t.name === teamName);
      if (team && team.role) {
        return this.mapRoleFromBackend(team.role);
      }
      
      return "Thành viên";
    } catch (error) {
      console.error('Error getting team member role:', error);
      return "Thành viên";
    }
  }

  /**
   * Get member info (Info button functionality)
   * @param userId - ID of the user
   * @returns Promise<Member> - Member information with teams
   */
  async getMemberInfo(userId: string): Promise<Member> {
    try {
      // Try to get user profile, but handle 500 errors gracefully
      let profile = null;
      try {
        const profileResponse = await apiClient.get<any>(`/user-profiles/${userId}`);
        profile = profileResponse.data.data || profileResponse.data;
      } catch (profileError) {
        console.warn(`Profile not found for user ${userId}, using basic info`);
        // Continue without profile data
      }

      // Try to get user teams, but handle errors gracefully
      let teams = [];
      try {
        const teamsResponse = await apiClient.get<any>(`/users/${userId}/teams`);
        teams = teamsResponse.data.data || teamsResponse.data || [];
      } catch (teamsError) {
        console.warn(`Teams not found for user ${userId}`);
        // Continue with empty teams
      }
      
      // Combine profile and teams data with fallbacks
      return {
        id: profile?.id ? parseInt(profile.id) : (isNaN(parseInt(userId)) ? 0 : parseInt(userId)), // Use profile ID if available, otherwise parse userId
        userId: userId,
        name: profile?.full_name || 'Unknown',
        email: profile?.email || '',
        class: profile?.class || '', // Add missing class property
        role: this.getPrimaryRole(teams), // Get primary role from teams
        teams: teams.map((team: any) => team.name),
        teamRoles: teams.reduce((acc: Record<string, string>, team: any) => {
          acc[team.name] = this.mapRoleFromBackend(team.role);
          return acc;
        }, {}),
        joinDate: profile?.created_at || profile?.join_date || undefined,
        status: 'active' // Default status
      };
    } catch (error) {
      console.error('Error fetching member info:', error);
      // Return basic member info even if everything fails
      return {
        id: isNaN(parseInt(userId)) ? 0 : parseInt(userId),
        userId: userId,
        name: 'Unknown',
        email: '',
        class: '',
        role: 'Thành viên',
        teams: [],
        teamRoles: {},
        joinDate: undefined,
        status: 'active'
      };
    }
  }

  /**
   * Update member info (Edit button functionality)
   * @param userId - ID of the user
   * @param profileData - Updated profile data
   * @returns Promise<void>
   */
  async updateMemberInfo(userId: string, profileData: any): Promise<void> {
    try {
      await apiClient.put('/user-profiles', {
        id: userId,
        ...profileData
      });
    } catch (error) {
      console.error('Error updating member info:', error);
      throw new Error('Failed to update member information');
    }
  }

  /**
   * Get available teams for adding members
   * @returns Promise<Array<{id: string, name: string}>> - List of available teams
   */
  async getAvailableTeams(): Promise<Array<{id: string, name: string}>> {
    try {
      const response = await apiClient.get<any>('/teams');
      const teams = response.data.data || response.data;
      
      return teams.map((team: any) => ({
        id: team.ID, // API uses capitalized field names
        name: team.Name
      }));
    } catch (error) {
      console.error('Error fetching available teams:', error);
      throw new Error('Failed to fetch available teams');
    }
  }

  /**
   * Get team head for a specific team
   * @param teamId - ID of the team
   * @returns Promise<string> - Name of the team head
   */
  // async getTeamHead(teamId: string): Promise<string> {
  //   try {
  //     // Get all members and filter for the specific team
  //     const result = await this.getMembers({}, 1, 1000); // Get all members
  //     const members = result.members;
      
  //     // Find members who are heads of the specific team
  //     const teamHead = members.find(member => {
  //       // Check if member is in the team and has HEADER role
  //       return member.teamRoles && 
  //              Object.values(member.teamRoles).includes('Trưởng ban') &&
  //              member.teams.some(teamName => {
  //                // We need to match by team name, but we have team ID
  //                // This is a limitation - we'd need team ID to name mapping
  //                return true; // For now, return first HEADER we find
  //              });
  //     });
      
  //     return teamHead ? teamHead.name : "Chưa xác định";
  //   } catch (error) {
  //     console.error('Error getting team head:', error);
  //     return "Chưa xác định";
  //   }
  // }

  /**
   * Get team heads for multiple teams efficiently
   * @param teamIds - Array of team IDs
   * @returns Promise<Record<string, string>> - Map of team ID to head name
   */
  async getTeamHeads(teamIds: string[]): Promise<Record<string, string>> {
    try {
      // Get all members once
      const result = await this.getMembers({}, 1, 1000);
      const members = result.members;
      
      // Get all teams to map IDs to names
      const teams = await teamService.getAllTeams();
      const teamIdToName = teams.reduce((acc, team) => {
        acc[team.id] = team.name;
        return acc;
      }, {} as Record<string, string>);
      
      const teamHeads: Record<string, string> = {};
      
      // Initialize all teams with default value
      teamIds.forEach(teamId => {
        teamHeads[teamId] = "Chưa xác định";
      });
      
      // Find heads for each team
      members.forEach(member => {
        if (member.teamRoles) {
          Object.entries(member.teamRoles).forEach(([teamName, role]) => {
            if (role === 'Trưởng ban') {
              // Find the team ID for this team name
              const teamId = Object.keys(teamIdToName).find(id => teamIdToName[id] === teamName);
              if (teamId && teamIds.includes(teamId)) {
                teamHeads[teamId] = member.name;
              }
            }
          });
        }
      });
      
      return teamHeads;
    } catch (error) {
      console.error('Error getting team heads:', error);
      // Return default values for all teams
      return teamIds.reduce((acc, teamId) => {
        acc[teamId] = "Chưa xác định";
        return acc;
      }, {} as Record<string, string>);
    }
  }

  /**
   * Helper method to get primary role from teams
   * @param teams - Array of team objects with roles
   * @returns string - Primary role
   */
  private getPrimaryRole(teams: any[]): string {
    if (!teams || teams.length === 0) return 'Thành viên';
    
    // Priority order: HEADER > VICE > MEMBER
    for (const team of teams) {
      if (team.role === 'HEADER') return this.mapRoleFromBackend('HEADER');
      if (team.role === 'VICE') return this.mapRoleFromBackend('VICE');
    }
    
    return 'Thành viên';
  }
}

export const memberService = new MemberService();