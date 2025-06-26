export interface Event {
  id?: number;
  title: string;
  date: string;
  address: string;
  participants: number;
  status?: string;
  requirements?: string;
}

export interface ApiError {
  message: string
  code: string
  details?: any
}