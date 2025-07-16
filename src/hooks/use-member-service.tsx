import { memberService } from "@/services/member-service";
import {
  Member,
  MemberStats,
  MemberListItem,
  MemberFilters,
} from "@/types/member";
import { useEffect, useState } from "react";

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
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useMembers(
  filters?: MemberFilters
): UseMemberServiceType<MemberListItem[]> {
  const [data, setData] = useState<MemberListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    memberService
      .getMembers(filters)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [filters]);

  return { data, loading, error };
}

export function useMember(id: number): UseMemberServiceType<Member | null> {
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
      .getMemberById(id)
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
    id: number,
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
