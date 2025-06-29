import { classService } from "@/services/class-service";
import { Class, Test } from "@/types/class";
import { useEffect, useState } from "react";

interface UseClassServiceType<T> {
  data: T;
  loading: boolean;
  error: Error | null;
}

export function useClasses(searchTerm?: string): UseClassServiceType<Class[]> {
  const [data, setData] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    const fetchClasses = async () => {
      try {
        let classes;
        if (searchTerm && searchTerm.trim()) {
          classes = await classService.searchClasses(searchTerm);
        } else {
          classes = await classService.getClasses();
        }
        setData(classes);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [searchTerm]);

  return { data, loading, error };
}

export function useClassesByStatus(
  status: "ongoing" | "upcoming" | "past"
): UseClassServiceType<Class[]> {
  const [data, setData] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    classService
      .getClassesByStatus(status)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [status]);

  return { data, loading, error };
}

export function useClass(id: number): UseClassServiceType<Class | null> {
  const [data, setData] = useState<Class | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    classService
      .getClassByID(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

export function useClassManagement() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const createClass = async (
    classData: Omit<Class, "id">
  ): Promise<Class | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await classService.createClass(classData);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      return null;
    }
  };

  const updateClass = async (
    id: number,
    data: Partial<Class>
  ): Promise<Class | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await classService.updateClass(id, data);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      return null;
    }
  };

  const deleteClass = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await classService.deleteClass(id);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      return false;
    }
  };

  return {
    createClass,
    updateClass,
    deleteClass,
    loading,
    error,
  };
}
