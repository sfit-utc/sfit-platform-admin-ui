import { Member, MemberStats, MemberListItem, MemberFilters, ApiError } from "@/types/member";
import apiClient from '@/libs/http';
import { teamService } from "./team-service";
import { Team } from "@/types/team";

class MemberService {
  private isUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value));
  }

  private async resolveTeamIds(inputs: string[]): Promise<string[]> {
    try {
      const teams = await teamService.getAllTeams();
      const byName = new Map<string, string>();
      for (const t of teams) {
        if (t?.name && t?.id) byName.set(String(t.name).toLowerCase(), String(t.id));
      }
      return inputs
        .map((raw) => {
          const s = String(raw);
          if (this.isUuid(s)) return s;
          const id = byName.get(s.toLowerCase());
          return id || s;
        })
        .filter((id) => this.isUuid(id));
    } catch {
      return inputs.filter((s) => this.isUuid(String(s)));
    }
  }
  private mapRoleCodeToLabel(role?: string): string {
    const code = (role || '').toUpperCase();
    if (code === 'HEADER' || code === 'HEAD') return 'Trưởng ban';
    if (code === 'VICE') return 'Phó ban';
    if (code === 'MEMBER' || code === 'USER') return 'Thành viên';
    return role || 'Thành viên';
  }

  private mapRoleLabelToCode(label?: string): string {
    const l = (label || '').toLowerCase();
    if (l.includes('trưởng')) return 'HEADER';
    if (l.includes('phó')) return 'VICE';
    return 'MEMBER';
  }

  private extractItems(respData: any): any[] {
    if (respData && typeof respData === 'object') {
      if (Array.isArray(respData.items)) return respData.items;
      if (respData.data && Array.isArray(respData.data.items)) return respData.data.items;
      if (Array.isArray(respData.data)) return respData.data;
    }
    return Array.isArray(respData) ? respData : [];
  }

  private normalizeTeam(team: any): { id: string; name: string } {
    const id = team?.id || team?.ID || team?.team_id || team?.TeamID || team?.TeamId || team?.Id || '';
    const name = team?.name || team?.Name || 'Unknown Team';
    return { id, name };
  }
  async getMemberStats(): Promise<MemberStats> {
    try {
      // Get all users to calculate stats (same approach as account service)
      const params = new URLSearchParams({ page: '1', page_size: '100' });
      const res = await apiClient.get(`/users?${params.toString()}`);
      const items = this.extractItems(res.data);

      const totalMembers = items.length;
      let activeMembers = 0;
      let leaders = 0;
      
      items.forEach((u: any) => {
        const status = (u.status || 'active').toString().toLowerCase();
        if (status === 'active') activeMembers++;
        
        // Check for leadership roles (HEADER, VICE, or admin roles)
        const roles: string[] = Array.isArray(u.roles)
          ? u.roles.map((x: any) => String(x).toUpperCase())
          : (u.role ? [String(u.role).toUpperCase()] : []);
        
        if (roles.includes('HEADER') || roles.includes('VICE') || roles.includes('ADMIN')) {
          leaders++;
        }
      });

      
      
      return {
        totalMembers,
        activeMembers,
        leaders,
        newMembers: 0, // Could be calculated based on join date if needed
      };
    } catch (error: any) {
      console.error("get member stats error: ", error);
      throw error;
    }
  }

  async getMembers(filters?: MemberFilters): Promise<MemberListItem[]> {
    try {
      const params = new URLSearchParams({ page: '1', page_size: '100' });
      const res = await apiClient.get(`/users?${params.toString()}`);
      const items = this.extractItems(res.data);

      let allMembers: MemberListItem[] = items.map((u: any) => ({
        id: Number(u.id) || u.user_id || 0,
        userId: u.id || u.user_id || u.ID || undefined,
        name: u.full_name || u.name || u.username || u.email || 'Unknown',
        role: this.mapRoleCodeToLabel(
          Array.isArray(u.roles) && u.roles.length > 0 ? u.roles[0] : (u.role || 'MEMBER')
        ),
        class: u.class_name || u.class || 'Chưa phân lớp',
        teams: Array.isArray(u.teams) ? u.teams.map((t: any) => t.name || String(t)) : [],
        avatar: u.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTJaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xMiAxNEM5LjMzIDE0IDcuMDEgMTUuMjQgNS41NiAxNy4yMkM2LjE5IDE4LjM5IDcuMzEgMTkuMjQgOC42IDE5LjI0SDE1LjRDMTYuNjkgMTkuMjQgMTcuODEgMTguMzkgMTguNDQgMTcuMjJDMTYuOTkgMTUuMjQgMTQuNjcgMTQgMTIgMTRaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo8L3N2Zz4K',
        lastActive: u.last_active || undefined,
        email: u.email,
        status: (u.status || 'active').toLowerCase(),
      }));

      // Enrich with teams if missing from /users response
      const enrichPromises = allMembers.map(async (m, idx) => {
        if ((!m.teams || m.teams.length === 0) && m.userId) {
          try {
            const teams = await teamService.getUserTeams(m.userId);
            allMembers[idx].teams = teams.map((t: Team) => t.name);
          } catch (e) {
            // ignore enrichment failure, keep empty teams
          }
        }
      });
      await Promise.all(enrichPromises);
      
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

  async getMemberById(id: number | string): Promise<Member> {
    try {
      
      // Try to fetch from /users endpoint first (since that's where we get the list from)
      let profile: any = {};
      try {
        const usersResponse = await apiClient.get(`/users?page=1&page_size=100`);
        const users = this.extractItems(usersResponse.data);
        
        // Find the user by ID (could be numeric or UUID)
        const user = users.find((u: any) => 
          u.id === id || 
          u.user_id === id || 
          u.ID === id ||
          String(u.id) === String(id) ||
          String(u.user_id) === String(id)
        );
        
        if (user) {
          profile = user;
        } else {
          // Fallback to user-profile endpoint
          const profileResponse = await apiClient.get(`/user-profile/${id}`);
          profile = profileResponse.data?.data || profileResponse.data || {};
        }
      } catch (e) {
        
      }

      // Fetch teams (joined)
      let teams: string[] = [];
      try {
        const teamsResponse = await apiClient.get(`/users/${id}/teams`);
        const teamsRaw = teamsResponse.data?.data || teamsResponse.data || [];
        const normalizedTeams = (Array.isArray(teamsRaw) ? teamsRaw : []).map((t: any) => this.normalizeTeam(t));
        teams = normalizedTeams.map((t) => t.name || 'Chưa có ban');
      } catch (e) {}

      const numericId = typeof id === 'number' ? id : (isFinite(Number(id)) ? Number(id) : (profile?.id ?? 0));
      
      // Handle role mapping - check if it's an array or single value
      let role = 'Thành viên';
      if (profile?.roles && Array.isArray(profile.roles) && profile.roles.length > 0) {
        role = this.mapRoleCodeToLabel(profile.roles[0]);
      } else if (profile?.role) {
        role = this.mapRoleCodeToLabel(profile.role);
      }
      
      return {
        id: numericId,
        name: profile?.full_name || profile?.name || profile?.username || profile?.email || 'Unknown',
        teams,
        role: role,
        class: profile?.class_name || profile?.class || 'Chưa phân lớp',
        email: profile?.email || '',
        avatar: profile?.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTJaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xMiAxNEM5LjMzIDE0IDcuMDEgMTUuMjQgNS41NiAxNy4yMkM2LjE5IDE4LjM5IDcuMzEgMTkuMjQgOC42IDE5LjI0SDE1LjRDMTYuNjkgMTkuMjQgMTcuODEgMTguMzkgMTguNDQgMTcuMjJDMTYuOTkgMTUuMjQgMTQuNjcgMTQgMTIgMTRaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo8L3N2Zz4K',
        status: profile?.status || 'active',
        joinDate: profile?.created_at || profile?.join_date || new Date().toISOString(),
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
        status: data.status,
      };
      
      const profileResponse = await apiClient.post('/user-profile/', profileData);
      const newProfile = profileResponse.data;
      
      
      if (data.teams && data.teams.length > 0) {
        try {
          const [firstTeamId] = await this.resolveTeamIds([String(data.teams[0])]);
          if (firstTeamId) {
            await apiClient.put(`/teams/${firstTeamId}/users/${newProfile.id}`, {
            role: this.mapRoleLabelToCode(data.role || 'Thành viên')
            });
          }
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

  async updateMember(id: number | string, data: Partial<Member>): Promise<Member> {
    try {
      

      // Map member data to user profile data format
      const profileData: any = {
        full_name: data.name || '',
        email: data.email || '',
        class_name: data.class || '',
        khoa: '',
        phone: '',
        introduction: '',
        social_link: {},
        avatar: '',
        cover_image: '',
        location: '',
        msv: '',
      };
      
      
      
      // Use admin endpoint to update other users' profiles (requires ADMIN)
      const response = await apiClient.put(`/user-profile/${id}/update`, profileData);
      

      // The backend wraps payload under data: { createAt, updateAt, profile | updatedData }
      const payload = (response?.data && response.data.data) ? response.data.data : (response.data || {});
      
      
      // Prefer the backend-provided profile; if missing, attempt to fetch fresh profile
      let updatedData: any = payload.profile || payload.updatedData || {};
      if ((!updatedData || Object.keys(updatedData).length === 0) && id) {
        try {
          const fresh = await apiClient.get(`/user-profile/${id}`);
          const freshData = fresh.data?.data || fresh.data || {};
          // Normalize naming to match expected fields
          updatedData = {
            full_name: freshData.full_name || freshData.name,
            email: freshData.email,
            class_name: freshData.class_name || freshData.class,
            role: freshData.role,
          };
        } catch (e) {
          // ignore fetch failure; will fall back to what we sent
        }
      }

      // If teams provided, add/update team memberships using team endpoints
      if (Array.isArray(data.teams) && data.teams.length > 0) {
        try {
          const resolved = await this.resolveTeamIds((data.teams as unknown as string[]) || []);
          if (resolved.length > 0) {
            await this.addMemberToTeams(String(id), resolved, data.role || 'Thành viên');
          }
        } catch (e) {
          
        }
      }

      // Build and return normalized Member to satisfy return type
      const numericId = typeof id === 'number' ? id : (isFinite(Number(id)) ? Number(id) : 0);
      const name = updatedData.full_name || updatedData.name || data.name || 'Unknown';
      const email = updatedData.email || data.email || '';
      const className = updatedData.class_name || updatedData.class || data.class || 'Chưa phân lớp';
      const roleLabel = this.mapRoleCodeToLabel(updatedData.role || 'MEMBER');
      const teams = Array.isArray(data.teams) ? data.teams.map((t: any) => String(t)) : [];

      return {
        id: numericId,
        name,
        teams,
        role: roleLabel,
        class: className,
        email,
        avatar: '',
        status: data.status || 'active',
        joinDate: new Date().toISOString(),
      };
    } catch (error) {
      console.error("update member error: ", error);
      throw error;
    }
  }

  async deleteMember(id: number): Promise<void> {
    try {
      // Remove from all teams first
      const teamsResponse = await apiClient.get(`/users/${id}/teams`);
      const teamsRaw = teamsResponse.data?.data || teamsResponse.data || [];
      const normalizedTeams = (Array.isArray(teamsRaw) ? teamsRaw : []).map((t: any) => this.normalizeTeam(t));
      
      for (const team of normalizedTeams) {
        if (!team.id) continue;
        try {
          await apiClient.delete(`/teams/${team.id}/users/${id}`);
        } catch (error) {
          console.warn(`Failed to remove user from team ${team.id}:`, error);
        }
      }
      
      // Delete user profile
      await apiClient.delete(`/user-profile/${id}`);
    } catch (error) {
      console.error("delete member error: ", error);
      throw error;
    }
  }

  
  async getTeamMembers(teamId: string): Promise<MemberListItem[]> {
    try {
      const response = await apiClient.get(`/teams/${teamId}/users?page=1&pageSize=100`);
      const members = this.extractItems(response.data);
      
      return members.map((member: any) => ({
        id: member.user_id || member.id,
        name: member.full_name || member.name || 'Unknown',
        role: this.mapRoleCodeToLabel(member.role),
        class: member.class_name || 'Chưa phân lớp',
        teams: [member.team_name || 'Unknown Team'],
        avatar: member.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTJaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xMiAxNEM5LjMzIDE0IDcuMDEgMTUuMjQgNS41NiAxNy4yMkM2LjE5IDE4LjM5IDcuMzEgMTkuMjQgOC42IDE5LjI0SDE1LjRDMTYuNjkgMTkuMjQgMTcuODEgMTguMzkgMTguNDQgMTcuMjJDMTYuOTkgMTUuMjQgMTQuNjcgMTQgMTIgMTRaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo8L3N2Zz4K',
        lastActive: member.last_active || 'Unknown',
        email: member.email,
        status: member.status || 'active',
      }));
    } catch (error) {
      console.error("get team members error: ", error);
      throw error;
    }
  }

  async getTeamMemberRole(teamId: string, userId: string | number): Promise<string> {
    try {
      let resolvedId = String(teamId);
      if (!this.isUuid(resolvedId)) {
        const [id] = await this.resolveTeamIds([resolvedId]);
        if (id) resolvedId = id;
      }
      const response = await apiClient.get(`/teams/${resolvedId}/users?page=1&page_size=100`);
      const members = this.extractItems(response.data);
      const uid = String(userId);
      const found = members.find((m: any) => String(m.user_id || m.id) === uid);
      return found ? this.mapRoleCodeToLabel(found.role) : 'Thành viên';
    } catch (error) {
      return 'Thành viên';
    }
  }

  async addMemberToTeam(teamId: string, userId: string, role: string = 'MEMBER'): Promise<void> {
    try {
      const roleCode = this.mapRoleLabelToCode(role);
      const [resolvedId] = await this.resolveTeamIds([teamId]);
      if (!resolvedId) throw new Error('Invalid team id or name');
      await apiClient.put(`/teams/${resolvedId}/users/${userId}`, { role: roleCode });
    } catch (error) {
      console.error("add member to team error: ", error);
      throw error;
    }
  }

  async removeMemberFromTeams(userId: string, teamIds: string[]): Promise<void> {
    try {
      const resolved = await this.resolveTeamIds(teamIds);
      const promises = resolved.map(teamId => apiClient.delete(`/teams/${teamId}/users/${userId}`));
      await Promise.all(promises);
    } catch (error) {
      console.error("remove member from teams error: ", error);
      throw error;
    }
  }

  async getAvailableTeams(): Promise<Array<{id: string, name: string}>> {
    try {
      const params = new URLSearchParams({ page: '1', pageSize: '100' });
      const response = await apiClient.get(`/teams?${params.toString()}`, {
        headers: { Authorization: '' },
      });
      const teams = this.extractItems(response.data);
      return teams.map((team: any) => ({ id: team.id || team.team_id || team.ID, name: team.name || team.team_name }));
    } catch (error) {
      
      return [];
    }
  }

  async addMemberToTeams(userId: string, teamIds: string[], role: string): Promise<void> {
    try {
    
      const roleCode = this.mapRoleLabelToCode(role);
      const resolved = await this.resolveTeamIds(teamIds);
      const promises = resolved.map(teamId => apiClient.put(`/teams/${teamId}/users/${userId}`, { role: roleCode }));
      
      await Promise.all(promises);
    } catch (error) {
      console.error("add member to teams error: ", error);
      throw error;
    }
  }

  async addMemberToTeamsWithRoles(userId: string, assignments: Array<{ team: string; role: string }>): Promise<void> {
    try {
      const teams = assignments.map(a => a.team);
      const resolved = await this.resolveTeamIds(teams);
      // Build name to id mapping
      const byNameOrId = new Map<string, string>();
      for (const team of teams) {
        const key = String(team);
        if (this.isUuid(key)) {
          byNameOrId.set(key.toLowerCase(), key);
        } else {
          const id = resolved.find(id => !!id);
          if (id) byNameOrId.set(key.toLowerCase(), id);
        }
      }
      const calls = assignments.map(a => {
        const key = String(a.team);
        const teamId = this.isUuid(key) ? key : (byNameOrId.get(key.toLowerCase()) || key);
        const roleCode = this.mapRoleLabelToCode(a.role);
        return apiClient.put(`/teams/${teamId}/users/${userId}`, { role: roleCode });
      });
      await Promise.all(calls);
    } catch (error) {
      console.error('add member to teams with roles error: ', error);
      throw error;
    }
  }

  // Update user info then add to one or many teams using team_members APIs
  async updateInfoAndAddToTeams(userId: string, data: Partial<Member>, teamIds: string[], role: string): Promise<void> {
    try {
      const profileData: any = {
        full_name: data.name || '',
        email: data.email || '',
        class_name: data.class || '',
        khoa: '',
        phone: '',
        introduction: '',
        social_link: {},
        avatar: '',
        cover_image: '',
        location: '',
        msv: '',
        // Backend admin endpoint expects label for role; but role in team_members expects enum code
        role: data.role || ''
      };
      // Update profile via admin endpoint
      await apiClient.put(`/user-profile/${userId}/update`, profileData);

      // Add to teams using your specified endpoints
      await this.addMemberToTeams(userId, teamIds, role);
    } catch (error) {
      console.error('update info and add to teams error: ', error);
      throw error;
    }
  }

  async removeMemberFromTeam(teamId: string, userId: string): Promise<void> {
    try {
      await teamService.removeMemberFromTeam(teamId, userId);
    } catch (error) {
      console.error("remove member from team error: ", error);
      throw error;
    }
  }

  async updateMemberRole(teamId: string, userId: string, newRole: string): Promise<void> {
    try {
      await teamService.updateMemberRole(teamId, userId, newRole);
    } catch (error) {
      console.error("update member role error: ", error);
      throw error;
    }
  }

  // Helper method to get current user ID from JWT token
  private getCurrentUserId(): string | null {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('No access token found');
        return null;
      }
      
      const [, payload] = token.split('.');
      const json = JSON.parse(atob(payload));
      const userId = json.sub || json.user_id || null;
      
      console.log('Parsed user ID from token:', userId);
      console.log('Token payload:', json);
      
      return userId;
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }

  // Helper method to check if token is expired
  private isTokenExpired(): boolean {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return true;
      }
      
      const [, payload] = token.split('.');
      const json = JSON.parse(atob(payload));
      const exp = json.exp;
      
      if (!exp) {
        return true;
      }
      
      // Add 5 minute buffer to account for clock skew and network delays
      const bufferTime = 5 * 60; // 5 minutes in seconds
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = exp - currentTime;
      
      // Debug: Log token expiration info
      console.log('Token expiration debug:', {
        currentTime,
        exp,
        timeUntilExpiry,
        bufferTime,
        isExpired: exp < (currentTime + bufferTime),
        daysUntilExpiry: (timeUntilExpiry / (24 * 60 * 60)).toFixed(2)
      });
      
      // Consider token expired if it expires within the next 5 minutes
      return exp < (currentTime + bufferTime);
    } catch (error) {
      console.error('Error parsing token:', error);
      return true;
    }
  }
}

export const memberService = new MemberService();