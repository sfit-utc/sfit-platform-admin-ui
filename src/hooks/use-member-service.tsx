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

export function useMemberStats(): UseMemberServiceType<MemberStats> & {
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<MemberStats>({
    totalMembers: 0,
    activeMembers: 0,
    leaders: 0,
    newMembers: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stats = await memberService.getMemberStats();
      setData(stats);
    } catch (error: any) {
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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { data, loading, error, refetch: fetchStats };
}

export function useMembers(
  filters?: MemberFilters,
  page: number = 1,
  pageSize: number = 10
): UseMemberServiceType<MemberListItem[]> & {
  refetch: () => Promise<void>;
  total: number;
  currentPage: number;
  pageSize: number;
} {
  const [data, setData] = useState<MemberListItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [pageSizeState, setPageSizeState] = useState<number>(pageSize);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await memberService.getMembers(
        filters,
        currentPage,
        pageSizeState
      );
      setData(result.members);
      setTotal(result.total);
      setCurrentPage(result.page);
      setPageSizeState(result.pageSize);
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
  }, [filters, currentPage, pageSizeState]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return {
    data,
    loading,
    error,
    refetch: fetchMembers,
    total,
    currentPage,
    pageSize: pageSizeState,
  };
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
      .getMemberInfo(String(id))
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

// Hook for getting member info (Info button functionality)
export function useMemberInfo(
  userId: string
): UseMemberServiceType<Member | null> & { refetch: () => Promise<void> } {
  const [data, setData] = useState<Member | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMemberInfo = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const memberInfo = await memberService.getMemberInfo(userId);
      setData(memberInfo);
    } catch (err: any) {
      console.error("Error fetching member info:", err);
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
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMemberInfo();
  }, [fetchMemberInfo]);

  return { data, loading, error, refetch: fetchMemberInfo };
}

// Custom hook for member management operations
export function useMemberManagement() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const updateMemberInfo = async (
    userId: string,
    profileData: any
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await memberService.updateMemberInfo(userId, profileData);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      return false;
    }
  };

  const deleteMember = async (userId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await memberService.deleteMember(userId);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      return false;
    }
  };

  return {
    updateMemberInfo,
    deleteMember,
    loading,
    error,
  };
}
