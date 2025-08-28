export interface TaskAssignment {
  task_id: string;
  user_id: string;
  create_at: string; 
  update_at: string; 
}

export interface ApiError {
  message: string
  code: string
  details?: any
}
