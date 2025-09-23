// Team-related types and interfaces

export interface Team {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  username: string;
  email: string;
  role?: TeamRole;
}

export interface TeamUser {
  team_id: string;
  name: string;
  role: TeamRole[];
}

export type TeamRole = 'HEADER' | 'VICE' | 'MEMBER';

// API Request/Response types
export interface CreateTeamRequest {
  name: string;
  description: string;
}

export interface CreateTeamResponse {
  id: string;
  create_at: string;
}

export interface UpdateTeamRequest {
  id: string;
  name: string;
  description: string;
}

export interface UpdateTeamResponse {
  updatedAt: string;
}

export interface AddMemberToTeamRequest {
  role: TeamRole;
}

export interface AddMemberToTeamResponse {
  id: string;
  create_at: string;
}

export interface UpdateMemberRoleRequest {
  role: TeamRole;
}

export interface UpdateMemberRoleResponse {
  updatedAt: string;
}

export interface TeamMembersResponse {
  users: TeamMember[];
  page: number;
  pageSize: number;
  total: number;
}

export interface UserTeamsResponse {
  team_id: string;
  name: string;
  role: TeamRole[];
}

// Query parameters
export interface TeamMembersQuery {
  page?: number;
  pageSize?: number;
}

// Error types
export interface TeamApiError {
  message: string;
  code: string;
  details?: any;
}