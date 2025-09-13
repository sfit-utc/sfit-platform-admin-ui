export interface UserProfile {
  id: string;
  full_name: string;
  class_name: string;
  khoa: string;
  phone: string;
  email: string;
  introduction: string;
  completed_course: number;
  joined_event: number;
  completed_task: number;
  social_link: {
    [key: string]: string;
  };
  created_at: string;
  updated_at: string;
  // Additional fields from API
  user_id?: string;
  avatar?: string;
  cover_image?: string;
  location?: string;
  msv?: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}
