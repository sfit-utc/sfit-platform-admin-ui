import { memberService } from "@/services/member-service";
import {
  Member,
  MemberStats,
  MemberListItem,
  MemberFilters,
} from "@/types/member";
import { useEffect, useState, useCallback } from "react";

interface UseMemberServiceType<T> {
  data: T;
  loading: boolean;
  error: Error | null;
}

export function useMemberStats(): UseMemberServiceType<MemberStats> {
  const [data, setData] = useState<MemberStats>({
    totalMembers: 0,
    activeMembers: 0,
    leaders: 0,
    newMembers: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    memberService
      .getMemberStats()
      .then(setData)
      .catch((error) => {
        console.error("Error fetching member stats:", error);
        if (
          error.message.includes("Token expired") ||
          error.message.includes("not authenticated")
        ) {
          setError(
            new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.")
          );
        } else {
          setError(error);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useMembers(
  filters?: MemberFilters
): UseMemberServiceType<MemberListItem[]> & { refetch: () => Promise<void> } {
  const [data, setData] = useState<MemberListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const members = await memberService.getMembers(filters);
      setData(members);
    } catch (err: any) {
      console.error("Error fetching members:", err);
      if (
        err.message.includes("Token expired") ||
        err.message.includes("not authenticated")
      ) {
        setError(
          new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.")
        );
      } else {
        setError(err);
      }
      setData([]); // Reset data on error
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { data, loading, error, refetch: fetchMembers };
}

export function useMember(
  id: number | string
): UseMemberServiceType<Member | null> {
  const [data, setData] = useState<Member | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    memberService
      .getMemberById(String(id))
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

// Custom hook for member management operations
export function useMemberManagement() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const updateMember = async (
    id: number | string,
    data: Partial<Member>
  ): Promise<Member | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await memberService.updateMember(id, data);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      return null;
    }
  };

  const deleteMember = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await memberService.deleteMember(id);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      return false;
    }
  };

  return {
    updateMember,
    deleteMember,
    loading,
    error,
  };
}
