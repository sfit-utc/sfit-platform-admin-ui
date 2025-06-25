import { committeeService } from "@/services/committeeService";
import { CommitteeInfo } from "@/types/committee";
import { useEffect, useState } from "react";

interface UseCommitteeServiceType<T> {
  data: T;
  loading: boolean;
  error: Error | null;
}

export function useAllCommitteeInfor(): UseCommitteeServiceType<
  CommitteeInfo[]
> {
  const [data, setData] = useState<CommitteeInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    committeeService
      .getAllCommitteeInformation()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
