export interface Account {
  id: number;
  userId: string;
  name: string;
  teams: string[];
  role: string;
  class: string;
  email?: string;
  avatar?: string;
  status?: 'active' | 'inactive';
  joinDate?: string;
}

export interface AccountStats {
  totalUsers: number;
  activeUsers: number;
  leaders: number;
  newUsers: number;
}

export interface AccountListItem {
  id: number;
  userId?: string;
  name: string;
  role: string;
  class: string;
  teams: string[];
  avatar?: string;
  lastActive?: string;
  email?: string;
}

export interface AccountFilters {
  role?: string;
  class?: string;
  team?: string;
  status?: string;
  search?: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}