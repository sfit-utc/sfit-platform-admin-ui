export type EventStatus = "DRAFT" | "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

export interface ListEventReq {
  page: number;
  page_size: number;
  title?: string;
  type?: string;
  status?: string;
  user_event_status?: string;
}

export interface QueryUsersInEvent {
  page: number;
  page_size: number;
  status: string;
}

export interface UpdateUserAttendanceReq {
  status: string;
}

export interface NewEventRequest {
  title: string;
  type: string;
  description: string;
  priority: number;
  location: string;
  max_people: number;
  agency: string;
  status: EventStatus;
  begin_at: string; 
  end_at: string;   
  tags?: string[];
}

export interface UpdateEventRequest {
  id: string;
  title: string;
  type: string;
  description: string;
  priority: number;
  location: string;
  max_people: number;
  agency: string;
  status: EventStatus;
  begin_at: string; 
  end_at: string;   
}

export interface EventDetailRp extends Event {
  tags: string[];
}

export interface Event {
  id: string; 
  title: string;
  type: string;
  description: string;
  priority: number;
  location: string;
  max_people: number;
  agency: string;
  status: EventStatus;
  begin_at: string;   
  endAt: string;     
  created_at: string; 
  updated_at: string; 
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}