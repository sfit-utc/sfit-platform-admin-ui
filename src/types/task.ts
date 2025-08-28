export interface Task {
  id: string; 
  event_id: string; 
  name: string;
  description?: string;
  start_date: string; 
  dead_line: string; 
  created_by: string; 
  percent_complete: number;
  create_at: string; 
  update_at: string; 
}

export interface ApiError {
  message: string
  code: string
  details?: any
}
