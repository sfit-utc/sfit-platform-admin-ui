export interface Class {
    id: number;
    title: string;
    description: string;
    teacher: string;
    time: string;
    schedule: string;
    address: string;
    status: 'ongoing' | 'upcoming' | 'past';
}

export interface Test {
    id: number;
    title: string;
    description: string;
    isRanking: boolean;
    date: string;
    time: string;
    status: 'upcoming' | 'ongoing' | 'past';
    participants: number;
}

export interface ApiError {
  message: string
  code: string
  details?: any
}