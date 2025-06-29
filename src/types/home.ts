export interface Task {
  id?: number;
  title: string;
  expired: string;
  percentComplete: number;
}

export interface Event {
  id?: number;
  eventTitle: string;
  when: string;
  howManyPeople: number;
  status?: string
}

export interface Class {
  id?: number;
  className: string;
  when: string;
  teacher: string;
  status?: string;
}

export interface ApiError {
  message: string
  code: string
  details?: any
}
