export interface Member {
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

export interface MemberStats {
  totalMembers: number;
  activeMembers: number;
  leaders: number;
  newMembers: number;
}

export interface MemberListItem {
  id: number;
  name: string;
  role: string;
  class: string;
  teams: string[];
  avatar?: string;
  lastActive?: string;
}

export interface MemberFilters {
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