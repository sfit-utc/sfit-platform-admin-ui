import { accountService } from "@/services/account-service";
import {
  Account,
  AccountStats,
  AccountListItem,
  AccountFilters,
} from "@/types/account";
import { useEffect, useState, useCallback } from "react";

interface UseAccountServiceType<T> {
  data: T;
  loading: boolean;
  error: Error | null;
}

export function useAccountStats(): UseAccountServiceType<AccountStats> & {
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<AccountStats>({
    totalUsers: 0,
    activeUsers: 0,
    leaders: 0,
    newUsers: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stats = await accountService.getAccountStats();
      setData(stats);
    } catch (error: any) {
      console.error("Error fetching account stats:", error);
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

export function useAccounts(
  filters?: AccountFilters,
  page: number = 1,
  pageSize: number = 10
): UseAccountServiceType<AccountListItem[]> & {
  refetch: () => Promise<void>;
  total: number;
  currentPage: number;
  pageSize: number;
} {
  const [data, setData] = useState<AccountListItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [pageSizeState, setPageSizeState] = useState<number>(pageSize);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const accounts = await accountService.getAccounts(filters);
      setData(accounts);
      setTotal(accounts.length);
      setCurrentPage(page);
      setPageSizeState(pageSize);
    } catch (err: any) {
      console.error("Error fetching accounts:", err);
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
  }, [filters, page, pageSize]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    data,
    loading,
    error,
    refetch: fetchAccounts,
    total,
    currentPage,
    pageSize: pageSizeState,
  };
}

export function useAccount(
  accountId: string | number
): UseAccountServiceType<Account | null> {
  const [data, setData] = useState<Account | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    if (!accountId) {
      setData(null);
      setLoading(false);
      return;
    }

    const fetchAccount = async () => {
      setLoading(true);
      setError(null);
      try {
        const account = await accountService.getAccountById(accountId);
        setData(account);
      } catch (err: any) {
        console.error("Error fetching account:", err);
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
    };

    fetchAccount();
  }, [accountId]);

  return { data, loading, error };
}

export function useAccountManagement() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const updateAccountInfo = useCallback(
    async (accountId: string, accountData: any) => {
      setLoading(true);
      setError(null);
      try {
        const result = await accountService.updateAccount(
          Number(accountId),
          accountData
        );
        return result;
      } catch (err: any) {
        console.error("Error updating account:", err);
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteAccount = useCallback(async (accountId: string) => {
    setLoading(true);
    setError(null);
    try {
      await accountService.deleteAccount(accountId);
    } catch (err: any) {
      console.error("Error deleting account:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAccountRole = useCallback(
    async (accountId: string, newRole: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await accountService.updateUserRole(accountId, newRole);
        return result;
      } catch (err: any) {
        console.error("Error updating account role:", err);
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeAccountRole = useCallback(
    async (accountId: string, role: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await accountService.removeUserRole(accountId, role);
        return result;
      } catch (err: any) {
        console.error("Error removing account role:", err);
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    updateAccountInfo,
    deleteAccount,
    updateAccountRole,
    removeAccountRole,
    loading,
    error,
  };
}

export function useAvailableRoles() {
  const [data, setData] = useState<Array<{ value: string; label: string }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      setError(null);
      try {
        const roles = await accountService.getAvailableRoles();
        setData(roles);
      } catch (err: any) {
        console.error("Error fetching available roles:", err);
        setError(err);
        // Set default roles on error
        setData([
          { value: "user", label: "Người dùng" },
          { value: "teacher", label: "Giáo viên" },
          { value: "moderator", label: "Điều hành viên" },
          { value: "admin", label: "Quản trị viên" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return { data, loading, error };
}
