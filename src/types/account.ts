export interface Account {
  id: number;
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
  totalMembers: number;
  activeMembers: number;
  leaders: number;
  newMembers: number;
}

export interface AccountListItem {
  id: number;
  name: string;
  role: string;
  class: string;
  teams: string[];
  avatar?: string;
  lastActive?: string;
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