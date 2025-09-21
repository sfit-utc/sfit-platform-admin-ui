import { useState, useEffect, useCallback } from "react";
import {
  Event,
  ListEventReq,
  NewEventRequest,
  UpdateEventRequest,
  EventDetailRp,
} from "@/types/event";
import { PageListResp } from "@/types/pagination";
import { eventService } from "@/services/event-service";

export const useEventService = () => {
  const [events, setEvents] = useState<EventDetailRp[]>([]);
  const [pagination, setPagination] = useState<PageListResp<EventDetailRp[]> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch events 
  const fetchEvents = useCallback(async (params: ListEventReq = { page: 1, page_size: 10, status: "UPCOMING" }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await eventService.getEvents(params);
      setEvents(res.data.items);
      setPagination(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch event detail
  const fetchEventDetail = useCallback(async (eventId: string) => {
    setLoading(true);
    setError(null);
    try {
      const detail = await eventService.getEventDetail(eventId);
      return detail.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch event detail");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new event
  const createEvent = useCallback(async (eventData: NewEventRequest) => {
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
  }, [fetchEvents]);

  // Update event
  const updateEvent = useCallback(async (eventId: string, eventData: UpdateEventRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await eventService.updateEvent(eventId, eventData);
      await fetchEvents();
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update event");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchEvents]);

  // Delete event
  const deleteEvent = useCallback(async (eventId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await eventService.deleteEvent(eventId);
      await fetchEvents();
      return res;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete event");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchEvents]);

  // Load events on mount
  // useEffect(() => {
  //   fetchEvents();
  // }, [fetchEvents]);

  return {
    events,
    pagination,
    loading,
    error,
    fetchEvents,
    fetchEventDetail,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};