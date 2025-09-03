import { useState, useEffect, useCallback } from "react";
import { Event } from "@/types/event";
import { eventService } from "@/services/event-service";
import { PaginatedResult } from "@/types/pagination";

export const useEventService = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch paginated events
  const fetchEvents = useCallback(
    async (params?: {
      page?: number;
      pageSize?: number;
      title?: string;
      type?: string;
      status?: string;
      onlyRegisted?: boolean;
      userId?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const {
          page: p = page,
          pageSize: ps = pageSize,
          title,
          type,
          status,
          onlyRegisted,
          userId,
        } = params || {};
        const res: PaginatedResult<Event> = await eventService.getEvents(
          p,
          ps,
          title,
          type,
          status,
          onlyRegisted,
          userId
        );

        setEvents(res.data.items);
        setTotal(res.data.total);
        setPage(res.data.page);
        setPageSize(res.data.pageSize);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize]
  );

  // Create new event
  const createEvent = useCallback(
    async (eventData: Omit<Event, "id" | "createdAt" | "updatedAt">) => {
      setLoading(true);
      setError(null);
      try {
        const newEvent = await eventService.createEvent(eventData);
        await fetchEvents(); 
        return newEvent;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create event");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchEvents]
  );

  // Update event
  const updateEvent = useCallback(
    async (id: string, eventData: Partial<Event>) => {
      setLoading(true);
      setError(null);
      try {
        const updatedEvent = await eventService.updateEvent(id, eventData);
        await fetchEvents();
        return updatedEvent;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update event");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchEvents]
  );

  // Delete event
  const deleteEvent = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await eventService.deleteEvent(id);
        await fetchEvents();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete event");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchEvents]
  );

  // Register for event
  const registerForEvent = useCallback(
    async (eventId: string, userId: string) => {
      setLoading(true);
      setError(null);
      try {
        await eventService.registerForEvent(eventId, userId);
        await fetchEvents();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to register for event"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchEvents]
  );

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    total,
    page,
    pageSize,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    setPage,
    setPageSize,
  };
};