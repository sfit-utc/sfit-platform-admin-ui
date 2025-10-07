import { useState, useEffect, useCallback } from "react";
import { profileService } from "@/services/profile-service";
import { UserProfile } from "@/types/profile";

interface UseProfileServiceReturn {
  userProfile: UserProfile | null;
  profileLoading: boolean;
  profileError: string | null;
  refetch: () => Promise<void>;
}

export const useProfileService = (userId?: string): UseProfileServiceReturn => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    if (!userId) return;

    setProfileLoading(true);
    setProfileError(null);

    try {
      const profile = await profileService.getUserProfile(userId);
      setUserProfile(profile);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setProfileError("Không thể tải thông tin hồ sơ");
    } finally {
      setProfileLoading(false);
    }
  }, [userId]); // Add userId as a dependency


  useEffect(() => {
    fetchUserProfile();
  }, [userId, fetchUserProfile]);

  return {
    userProfile,
    profileLoading,
    profileError,
    refetch: fetchUserProfile,
  };
};
