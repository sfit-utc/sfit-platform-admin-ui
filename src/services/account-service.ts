import { Account, AccountStats, AccountListItem, AccountFilters } from "@/types/account";
import apiClient from "@/libs/http";

function extractItems(respData: any): any[] {
  // Backend page list shape: { data: { items, page, pageSize, totalCount }, message, status }
  if (respData && typeof respData === "object") {
    if (Array.isArray(respData.items)) return respData.items;
    if (respData.data && Array.isArray(respData.data.items)) return respData.data.items;
    if (Array.isArray(respData.data)) return respData.data; // fallback
  }
  return Array.isArray(respData) ? respData : [];
}

function normalizeRole(r: any): "user" | "admin" {
  const val = (typeof r === "string" ? r : "").toLowerCase();
  if (val === "admin") return "admin";
  return "user";
}

class AccountService {
  async getAccountStats(): Promise<AccountStats> {
    // Pull a big first page to approximate stats
    const params = new URLSearchParams({ page: "1", page_size: "10" });
    const res = await apiClient.get(`/users?${params.toString()}`);
    const items = extractItems(res.data);

    const totalUsers = items.length;
    let activeUsers = 0;
    let admins = 0;

    items.forEach((u: any) => {
      const status = (u.status || "active").toString().toLowerCase();
      if (status === "active") activeUsers++;
      const roles: string[] = Array.isArray(u.roles)
        ? u.roles.map((x: any) => String(x).toLowerCase())
        : (u.role ? [String(u.role).toLowerCase()] : []);
      if (roles.includes("admin")) admins++;
    });

    return {
      totalUsers,
      activeUsers,
      leaders: admins,
      newUsers: 0,
    };
  }

  async getAccounts(filters?: AccountFilters): Promise<AccountListItem[]> {
    const params = new URLSearchParams({ page: "1", page_size: "20" });
    const res = await apiClient.get(`/users?${params.toString()}`);
    const items = extractItems(res.data);

    // Fetch roles for all users
    let mapped: AccountListItem[] = await Promise.all(
      items.map(async (u: any) => {
        const name = u.full_name || u.name || u.username ||   "Unknown";
        const userId = u.id || u.user_id || u.ID;
        
        // Check if role is already in the user data
        let role = "user";
        
        if (u.role) {
          // Use role from user data if available
          role = u.role.toLowerCase();
        } else if (u.roles && Array.isArray(u.roles) && u.roles.length > 0) {
          // Prioritize ADMIN over USER when multiple roles exist
          const roles = u.roles.map((r: any) => String(r).toUpperCase());
          if (roles.includes("ADMIN")) {
            role = "admin";
          } else {
            role = roles[0].toLowerCase();
          }
        } else {
          // Fallback to API call
          try {
            role = await this.getUserRole(userId);
          } catch (error) {
            console.warn(`Could not fetch role for user ${userId}, using default:`, error);
          }
        }

        return {
          id: u.id ? Number(u.id) : 0,
          userId: userId,
          name: String(name),
          role: normalizeRole(role),
          class: u.class_name || u.class || "",
          teams: Array.isArray(u.teams) ? u.teams.map((t: any) => t.name || String(t)) : [],
          avatar: u.avatar || undefined,
          lastActive: u.last_active || undefined,
        };
      })
    );

    if (filters) {
      if (filters.role) mapped = mapped.filter(a => a.role.toLowerCase().includes(filters.role!.toLowerCase()));
      if (filters.class) mapped = mapped.filter(a => a.class.toLowerCase().includes(filters.class!.toLowerCase()));
      if (filters.team) mapped = mapped.filter(a => a.teams.some(t => t.toLowerCase().includes(filters.team!.toLowerCase())));
      if (filters.search) {
        const q = filters.search.toLowerCase();
        mapped = mapped.filter(a =>
          a.name.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q) ||
          a.class.toLowerCase().includes(q) ||
          a.teams.some(t => t.toLowerCase().includes(q))
        );
      }
    }

    return mapped;
  }

  async getAccountById(id: string | number): Promise<Account> {
    // Prefer profile details if available
    const profileRes = await apiClient.get(`/user-profiles/${id}`);
    const payload = profileRes.data?.data || profileRes.data || {};
    // Get user role from roles endpoint
    let role = "user";
    try {
      role = await this.getUserRole(id);
    } catch (error) {
      console.warn(`Could not fetch role for user ${id}, using default:`, error);
    }

    // Teams joined
    let teams: string[] = [];
    try {
      const teamsRes = await apiClient.get(`/users/${id}/teams`);
      const titems = extractItems(teamsRes.data);
      teams = titems.map((t: any) => t.name || String(t.id || "Team"));
    } catch {}

    const name = payload.full_name || payload.username || payload.name ||    "Unknown";

    return {
      id: payload.id ? parseInt(payload.id) : 0, // Use profile ID for sequential display
      userId: String(id), // Store the original UUID as userId
      name: String(name),
      role: normalizeRole(role),
      class: payload.class_name || "",
      teams,
      email: payload.email || undefined,
      avatar: payload.avatar || undefined,
      status: payload.status || undefined,
      joinDate: payload.created_at || undefined,
    };
  }

  async updateAccount(id: number, data: Partial<Account> & { email?: string; oldPassword?: string; newPassword?: string; }): Promise<Account> {
    const payload: any = {};
    if (data.email) payload.email = data.email;
    if (data.oldPassword) payload.oldPassword = data.oldPassword;
    if (data.newPassword) payload.newPassword = data.newPassword;

    await apiClient.patch(`/users/${id}`, payload);
    return this.getAccountById(id);
  }

  async updateUserRole(userId: string | number, role: string): Promise<any> {
    try {
      const response = await apiClient.post(`/users/${userId}/roles`, [role.toUpperCase()]);
      return response.data;
    } catch (error: any) {
      console.error('Error updating user role:', error);
      throw new Error('Failed to update user role');
    }
  }

  async removeUserRole(userId: string | number, role: string): Promise<any> {
    try {
      const response = await apiClient.delete(`/users/${userId}/roles`, {
        data: [role.toUpperCase()]
      });
      return response.data;
    } catch (error: any) {
      console.error('Error removing user role:', error);
      throw new Error('Failed to remove user role');
    }
  }

  async deleteAccount(id: string | number): Promise<void> {
    try {
      await apiClient.delete(`/user-profiles/${id}`);
    } catch (error: any) {
      console.error('Error deleting account:', error);
      throw new Error('Failed to delete account');
    }
  }

  async getUserRole(userId: string | number): Promise<string> {
    try {
      const response = await apiClient.get(`/users/${userId}/roles`);
      
      // Extract roles from response.data.data (the actual array is nested)
      const roles = response.data.data || response.data;
      
      if (Array.isArray(roles) && roles.length > 0) {
        // Prioritize ADMIN over USER when multiple roles exist
        const upperRoles = roles.map((r: any) => String(r).toUpperCase());
        
        if (upperRoles.includes('ADMIN')) {
          return 'admin';
        } else {
          return 'user';
        }
      }
      
      return 'user'; // Default role
    } catch (error) {
      console.error(`Error fetching user role for user ${userId}:`, error);
      return 'user'; // Default role on error
    }
  }


  async getTeamMemberRole(teamName: string, userId: string): Promise<string> {
    try {
      // Get user's teams to find the specific role for the team
      const response = await apiClient.get(`/users/${userId}/teams`);
      const teams = extractItems(response.data);
      
      const team = teams.find((t: any) => 
        (t.name || String(t.id || "")).toLowerCase() === teamName.toLowerCase()
      );
      
      if (team && team.role) {
        return team.role;
      }
      
      return "Thành viên"; // Default role
    } catch (error) {
      console.error(`Error fetching team role for user ${userId} in team ${teamName}:`, error);
      return "Thành viên"; // Default role on error
    }
  }

  async addUserToTeam(teamId: string, userId: string, role: string): Promise<any> {
    try {
      const response = await apiClient.put(`/teams/${teamId}/users/${userId}`, {
        role: role
      });
      return response.data;
    } catch (error) {
      console.error('Error adding user to team:', error);
      throw new Error('Failed to add user to team');
    }
  }

  async createAccount(accountData: {
    name: string;
    email: string;
    password: string;
    role: string;
    class?: string;
  }): Promise<any> {
    try {
      // Step 1: Register the user
      const registerResponse = await apiClient.post('/auth/register', {
        username: accountData.name,
        email: accountData.email,
        password: accountData.password,
      });

      const userData = registerResponse.data;
      const userId = userData.id || userData.user_id || userData.userId;

      if (userId) {
        try {
          // Step 2: Create a blank user profile to avoid 500 errors
          await apiClient.post('/user-profiles', {
            user_id: userId,
            full_name: accountData.name,
            email: accountData.email,
            class_name: accountData.class || '',
            // Add any other required fields for user profile
          });
        } catch (profileError: any) {
          console.warn('Could not create user profile, but user was registered:', profileError);
          // Don't throw error here as user registration was successful
        }
      }

      return userData;
    } catch (error: any) {
      console.error('Error creating account:', error);
      if (error.response?.status === 409) {
        throw new Error('email already exists');
      }
      throw new Error('Failed to create account');
    }
  }

  async getAvailableRoles(): Promise<Array<{ value: string; label: string }>> {
    return [
      { value: 'user', label: 'Người dùng' },
      { value: 'admin', label: 'Quản trị viên' }
    ];
  }
}

export const accountService = new AccountService();
