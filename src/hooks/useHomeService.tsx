import { homeService } from "@/services/homeService";
import { Class, Event, Task } from "@/types/home";
import { useEffect, useState } from "react";

interface UseHomeServiceType<T> {
  data: T;
  loading: boolean;
  error: Error | null;
}

export function useNearTask(): UseHomeServiceType<Task[]> {
  const [data, setData] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    homeService
      .getNearTasks()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useUpcomingEvents(): UseHomeServiceType<Event[]> {
  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    homeService
      .getUpcomingEvents()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useClass(): UseHomeServiceType<Class[]> {
  const [data, setData] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    homeService
      .getClasses()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useStartedEvent(): UseHomeServiceType<Event[]> {
  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    homeService
      .getEventStarted()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useWeekClasses() {
  const [data, setData] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    homeService
      .getWeekClasses()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
