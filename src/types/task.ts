export interface Event {
    id?: number;
    title: string;
    date: string;
    address: string;
    participants: number;
    status?: string;
    requirements?: string;
}

export interface Task {
  id: number;
  eventId: number;
  title: string;
  tags: { label: string; color: string; textColor: string }[];
  description?: string;
  startDate: string;
  deadline: string;
  assignee: string;
  percentComplete: number;
}
export interface ApiError {
  message: string
  code: string
  details?: any
}
