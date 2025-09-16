export interface CreateTaskReq {
  name: string;
  description: string;
  event_id?: string;
  startTime: string;   
  dateline: string;     
}

export interface UpdateTaskReq {
  name?: string;
  description?: string;
  percent_complete?: number;
  start_date?: string;  
  deadline?: string;    
}

export interface ListTaskQuery {
  page: number;
  page_size: number;
  name?: string;
  event_id?: string;
  is_completed?: boolean;
}

export interface AddUserTaskReq {
  task_id: string;
}

export interface ListTaskOfUserReq {
  page: number;
  page_size: number;
  is_completed?: boolean;
}

export interface ListTasksByEventID {
  page: number;
  page_size: number;
  is_completed?: boolean;
}

export interface UpdateTaskUserStatusReq {
  is_completed: boolean;
}

export interface ResponseTasksOfUser {
  id: string;
  event_id?: string | null;
  name: string;
  description: string;
  start_date: string;         
  deadline: string;           
  percent_complete: number;
  create_by: string;
  created_at: string;         
  updated_at: string;         
  is_completed: boolean;
}

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
