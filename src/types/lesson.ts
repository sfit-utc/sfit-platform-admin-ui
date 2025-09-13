
// Lesson Types
export type LessonType = "Quiz" | "Online" | "Offline" | "Reading";

// Quiz Content
export interface Quiz {
  question: string;
  answers: string[];
  correct_answers: number[];
}

export interface OnlineContentStruct {
  video_url: string;
}

export interface OfflineContentStruct {
  location: string;
  date: string; 
}

export interface ReadingContentStruct {
  content: string;
}

export interface Lesson {
  id: string; 
  type: LessonType;
  title: string;
  module_id: string; 
  course_id: string; 
  description: string;
  duration: number;
  quiz_content?: Quiz[];
  online_content?: OnlineContentStruct;
  offline_content?: OfflineContentStruct;
  reading_content?: ReadingContentStruct;
  created_at: string; 
  updated_at: string; 
}

// Attendance Status
export type LessonAttendanceStatus =
  | "present"
  | "absent_excused"
  | "absent_unexcused"
  | "late";

// Lesson Attendance
export interface LessonAttendance {
  user_id: string; 
  lesson_id: string; 
  course_id: string; 
  quiz_point?: number;
  duration?: number;
  status: LessonAttendanceStatus;
  device_id?: string; 
  moderator_id: string; 
  created_at: string; 
  updated_at: string; 
}

// Request/Response DTOs

export interface LessonRequest {
  title: string;
  description: string;
  duration: number;
  type: LessonType;
  quiz_content?: Quiz[];
  video_url?: string;
  location?: string;
  date?: string; 
  reading_content?: string;
}

export interface UpdateStatusLessonAttendanceReq {
  status: LessonAttendanceStatus;
  device_id: string;
  duration: number;
  answer: number[][];
}

export interface GetUserAttendanceLessonReq {
  page: number;
  page_size: number;
  status?: LessonAttendanceStatus;
}

export interface GetUserAttendanceLessonRp {
  id: string; // user_id
  username: string;
  email: string;
  status: string;
  quiz_point?: number;
  duration?: number;
  device_id?: string;
  moderator_id: string;
}