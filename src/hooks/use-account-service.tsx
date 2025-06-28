import { accountService } from "@/services/account-service";
import {
  Account,
  AccountStats,
  AccountListItem,
  AccountFilters,
} from "@/types/account";
import { useEffect, useState } from "react";

interface UseAccountServiceType<T> {
  data: T;
  loading: boolean;
  error: Error | null;
}

export function useAccountStats(): UseAccountServiceType<AccountStats> {
  const [data, setData] = useState<AccountStats>({
    totalMembers: 0,
    activeMembers: 0,
    leaders: 0,
    newMembers: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    accountService
      .getAccountStats()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useAccounts(
  filters?: AccountFilters
): UseAccountServiceType<AccountListItem[]> {
  const [data, setData] = useState<AccountListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    accountService
      .getAccounts(filters)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [filters]);

  return { data, loading, error };
}

export function useAccount(id: number): UseAccountServiceType<Account | null> {
  const [data, setData] = useState<Account | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    accountService
      .getAccountById(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

// Custom hook for account management operations
export function useAccountManagement() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const updateAccount = async (
    id: number,
    data: Partial<Account>
  ): Promise<Account | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await accountService.updateAccount(id, data);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      return null;
    }
  };

  const deleteAccount = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await accountService.deleteAccount(id);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      return false;
    }
  };

  return {
    updateAccount,
    deleteAccount,
    loading,
    error,
  };
}
