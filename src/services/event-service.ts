import apiClient from "@/libs/http";
import {
  Event,
  EventStatus,
  ListEventReq,
  NewEventRequest,
  UpdateEventRequest,
  EventDetailRp,
  QueryUsersInEvent,
  UpdateUserAttendanceReq,
  ApiError,
} from "@/types/event";
import { PageListResp } from "@/types/pagination";

class EventService {
  async getEvents(
    params: ListEventReq = { page: 1, page_size: 20, status: "ONGOING" }
  ): Promise<PageListResp<EventDetailRp[]>> {
    const response = await apiClient.get("/events", { params });
    return response.data;
  }

  async getEventDetail(eventId: string): Promise<EventDetailRp> {
    const response = await apiClient.get(`/events/${eventId}`);
    return response.data;
  }

  async createEvent(
    event: NewEventRequest
  ): Promise<{ id: string; createdAt: string }> {
    const response = await apiClient.post("/events", event);
    return response.data;
  }

  async updateEvent(eventId: string, event: UpdateEventRequest): Promise<any> {
    const response = await apiClient.put(`/events/${eventId}`, event);
    return response.data;
  }

  async deleteEvent(eventId: string): Promise<{ message: string }> {
    await apiClient.delete(`/events/${eventId}`);
    return { message: "Deleted successfully" };
  }

  async getUsersInEvent(
    eventId: string,
    params: QueryUsersInEvent
  ): Promise<PageListResp<any[]>> {
    const response = await apiClient.get(`/events/${eventId}/users`, {
      params,
    });
    return response.data;
  }

  async updateUserAttendance(
    eventId: string,
    userId: string,
    data: UpdateUserAttendanceReq
  ): Promise<void> {
    await apiClient.put(`/events/${eventId}/users/${userId}/attendance`, data);
  }
}

export const eventService = new EventService();
