export interface Team {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTeamRequest {
  name: string;
  description: string;
}

export interface CreateTeamResponse {
  id: string;
  create_at: string;
}