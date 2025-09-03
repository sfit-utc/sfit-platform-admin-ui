export type EventStatus = 
  | 'DRAFT'
  | 'UPCOMING'
  | 'ONGOING'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Event {
  id?: string; 
  title: string;
  type: string;
  description: string;
  priority: number;
  location: string;
  maxPeople: number;
  agency: string;
  status: EventStatus;
  beginAt: string;   
  endAt: string;     
  createdAt?: string; 
  updatedAt?: string; 
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}