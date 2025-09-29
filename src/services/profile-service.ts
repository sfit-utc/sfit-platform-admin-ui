import { UserProfile, ApiError } from "@/types/profile";
import apiClient from '@/libs/http';

interface CreateProfileRequest {
  full_name: string;
  class_name: string;
  khoa: string;
  phone: string;
  msv: string;
  introduction: string;
  social_link: {
    [key: string]: string;
  };
}

interface UpdateProfileRequest {
  id: string;
  full_name: string;
  class_name: string;
  khoa: string;
  email: string;
  phone: string;
  msv: string;
  introduction: string;
  social_link: {
    [key: string]: string;
  };
}

interface CreateProfileResponse {
  id: string;
  createdAt: string;
}

interface UpdateProfileResponse {
  updatedAt: string;
  createdAt: string;
}

class ProfileService {
  /**
   * Lấy thông tin profile người dùng
   * @param userId - ID của người dùng
   * @returns Promise<UserProfile> - Thông tin profile người dùng
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await apiClient.get<any>(`/user-profiles/${userId}`);
      // Extract the actual profile data from the response structure
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error(`Failed to fetch user profile for user ${userId}`);
    }
  }

  /**
   * Tạo profile người dùng mới
   * @param profileData - Dữ liệu profile cần tạo
   * @returns Promise<CreateProfileResponse> - Kết quả tạo profile
   */
  async createUserProfile(profileData: CreateProfileRequest): Promise<CreateProfileResponse> {
    try {
      const response = await apiClient.post<any>('/user-profiles', profileData);
      // Extract the actual response data from the API structure
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error('Failed to create user profile');
    }
  }

  /**
   * Cập nhật thông tin user profile
   * @param profileData - Dữ liệu profile cần cập nhật
   * @returns Promise<UpdateProfileResponse> - Kết quả cập nhật profile
   */
  async updateUserProfile(profileData: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    try {
      const response = await apiClient.put<any>('/user-profiles', profileData);
      // Extract the actual response data from the API structure
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }
}

export const profileService = new ProfileService();
