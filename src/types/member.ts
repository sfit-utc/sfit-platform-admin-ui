export interface Member {
  id: number;
  userId?: string; // Link to user account
  name: string;
  teams: string[];
  role: string;
  class: string;
  email?: string;
  avatar?: string;
  status?: 'active' | 'inactive';
  joinDate?: string;
  lastActive?: string;
}

export interface MemberStats {
  totalMembers: number;
  activeMembers: number;
  leaders: number;
  newMembers: number;
}

export interface MemberListItem {
  id: number;
  userId?: string; // Link to user account
  name: string;
  role: string;
  class: string;
  teams: string[];
  avatar?: string;
  lastActive?: string;
  email?: string;
  status?: 'active' | 'inactive';
}

export interface MemberFilters {
  role?: string;
  class?: string;
  team?: string;
  status?: string;
  search?: string;
}

export interface CreateMemberRequest {
  userId?: string;
  name: string;
  email: string;
  role: string;
  class: string;
  teams: string[];
  status?: 'active' | 'inactive';
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
} 