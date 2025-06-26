import { useState, useEffect, useCallback } from "react";
import { Event } from "@/types/event";
import { eventService } from "@/services/eventService";

export const useEventService = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all events
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventService.getEvents();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new event
  const createEvent = useCallback(async (eventData: Omit<Event, "id">) => {
    setLoading(true);
    setError(null);
    try {
      const newEvent = await eventService.createEvent(eventData);
      setEvents((prev) => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update event
  const updateEvent = useCallback(
    async (id: number, eventData: Partial<Event>) => {
      setLoading(true);
      setError(null);
      try {
        const updatedEvent = await eventService.updateEvent(id, eventData);
        setEvents((prev) =>
          prev.map((event) => (event.id === id ? updatedEvent : event))
        );
        return updatedEvent;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update event");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete event
  const deleteEvent = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await eventService.deleteEvent(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete event");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register for event
  const registerForEvent = useCallback(
    async (eventId: number, userId: number) => {
      setLoading(true);
      setError(null);
      try {
        await eventService.registerForEvent(eventId, userId);
        // Optionally refresh events or update local state
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

  // Load events on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
  };
};
