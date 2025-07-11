import { committeeDetailService } from "@/services/committee-detail-service";
import {
  CommitteeDetail,
  MemberOfCommittee,
  Target,
  Task,
} from "@/types/committee";
import { useEffect, useState } from "react";

interface UseCommitteeServiceType<T> {
  data: T;
  loading: boolean;
  error: Error | null;
}

interface UseCommitteeServiceTypeRefreshAble<T> {
  data: T;
  loading: boolean;
  error: Error | null;
  fetchData: () => void;
}

export function useCommitteeDetail(
  id: number
): UseCommitteeServiceType<CommitteeDetail | undefined> {
  const [data, setData] = useState<CommitteeDetail>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    committeeDetailService
      .getCommitteeInfor(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

export function useListMembersOfCommittee(
  id: number
): UseCommitteeServiceType<MemberOfCommittee[]> {
  const [data, setData] = useState<MemberOfCommittee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    committeeDetailService
      .getMemberOfCommittee(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

export function useTasksOfCommittee(
  id: number
): UseCommitteeServiceType<Task[]> {
  const [data, setData] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    committeeDetailService
      .getTask(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

export function usePeriod(id: number): UseCommitteeServiceType<string> {
  const [data, setData] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    committeeDetailService
      .getPeriod(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

export function useCommitteeTarget(
  id: number
): UseCommitteeServiceTypeRefreshAble<Target[]> {
  const [data, setData] = useState<Target[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = () => {
    setLoading(true);
    committeeDetailService
      .getCommitteeTarget(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData()
  }, [id]);

  return { data, loading, error, fetchData: fetchData };
}
