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

function normalizeRole(r: any): "user" | "admin" | "moderator" {
  const val = (typeof r === "string" ? r : "").toLowerCase();
  if (val === "admin") return "admin";
  if (val === "moderator") return "moderator";
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
    let moderators = 0;

    items.forEach((u: any) => {
      const status = (u.status || "active").toString().toLowerCase();
      if (status === "active") activeUsers++;
      const roles: string[] = Array.isArray(u.roles)
        ? u.roles.map((x: any) => String(x).toLowerCase())
        : (u.role ? [String(u.role).toLowerCase()] : []);
      if (roles.includes("admin")) admins++;
      if (roles.includes("moderator")) moderators++;
    });

    return {
      totalUsers,
      activeUsers,
      leaders: admins + moderators,
      newUsers: 0,
    };
  }

  async getAccounts(filters?: AccountFilters): Promise<AccountListItem[]> {
    const params = new URLSearchParams({ page: "1", page_size: "20" });
    const res = await apiClient.get(`/users?${params.toString()}`);
    const items = extractItems(res.data);

    let mapped: AccountListItem[] = items.map((u: any) => {
      const name = u.full_name || u.name || u.username || u.email || "Unknown";
      const role = Array.isArray(u.roles) && u.roles.length > 0 ? u.roles[0] : (u.role || "user");
      return {
        id: Number(u.id) || 0,
        name: String(name),
        role: normalizeRole(role),
        class: u.class_name || u.class || "",
        teams: Array.isArray(u.teams) ? u.teams.map((t: any) => t.name || String(t)) : [],
        avatar: u.avatar || undefined,
        lastActive: u.last_active || undefined,
      };
    });

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

  async getAccountById(id: number): Promise<Account> {
    // Prefer profile details if available
    const profileRes = await apiClient.get(`/user-profiles/${id}`);
    const payload = profileRes.data?.data || profileRes.data || {};

    // Teams joined
    let teams: string[] = [];
    try {
      const teamsRes = await apiClient.get(`/users/${id}/teams`);
      const titems = extractItems(teamsRes.data);
      teams = titems.map((t: any) => t.name || String(t.id || "Team"));
    } catch {}

    const name = payload.full_name || payload.name || payload.username || payload.email || "Unknown";
    const role = Array.isArray(payload.roles) && payload.roles.length > 0 ? payload.roles[0] : (payload.role || "user");

    return {
      id,
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
    // Backend supports changing email and password on /users/:id via UpdateUserDto
    const payload: any = {};
    if (data.email) payload.email = data.email;
    if (data.oldPassword) payload.oldPassword = data.oldPassword;
    if (data.newPassword) payload.newPassword = data.newPassword;

    await apiClient.patch(`/users/${id}`, payload);
    return this.getAccountById(id);
  }

  async deleteAccount(id: number): Promise<void> {
    // Not supported by backend route listing; implement if backend exposes a delete
    throw new Error("Delete user not supported by backend API");
  }
}

export const accountService = new AccountService();
