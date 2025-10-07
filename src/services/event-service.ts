import apiClient from "@/libs/http";
import {
  ListEventReq,
  NewEventRequest,
  UpdateEventRequest,
  EventDetailRp,
  QueryUsersInEvent,
  UpdateUserAttendanceReq,
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

  async updateEvent(event: UpdateEventRequest): Promise<EventDetailRp> {
    const response = await apiClient.put(`/events`, event);
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
  // async getEventById(id: number): Promise<Event> {
  //   if (USE_MOCK_DATA) {
  //     await this.simulateDelay();
  //     const event = mockEvents.find(e => e.id === id);
  //     if (!event) {
  //       throw new Error('Event not found');
  //     }
  //     return event;
  //   }

  //   const response = await fetch(`${API_BASE_URL}/events/${id}`);
  //   return this.handleResponse<Event>(response);
  // }

  // async createEvent(event: Omit<Event, 'id'>): Promise<Event> {
  //   if (USE_MOCK_DATA) {
  //     await this.simulateDelay();
  //     const newEvent: Event = {
  //       ...event,
  //       id: Math.max(...mockEvents.map(e => e.id || 0)) + 1,
  //     };
  //     mockEvents.push(newEvent);
  //     return newEvent;
  //   }

  //   const response = await fetch(`${API_BASE_URL}/events`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(event),
  //   });
  //   return this.handleResponse<Event>(response);
  // }

  // async updateEvent(id: number, eventData: Partial<Event>): Promise<Event> {
  //   if (USE_MOCK_DATA) {
  //     await this.simulateDelay();
  //     const eventIndex = mockEvents.findIndex(e => e.id === id);
  //     if (eventIndex === -1) {
  //       throw new Error('Event not found');
  //     }

  //     mockEvents[eventIndex] = { ...mockEvents[eventIndex], ...eventData };
  //     return mockEvents[eventIndex];
  //   }

  //   const response = await fetch(`${API_BASE_URL}/events/${id}`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(eventData),
  //   });
  //   return this.handleResponse<Event>(response);
  // }

  // async deleteEvent(id: number): Promise<void> {
  //   if (USE_MOCK_DATA) {
  //     await this.simulateDelay();
  //     const eventIndex = mockEvents.findIndex(e => e.id === id);
  //     if (eventIndex === -1) {
  //       throw new Error('Event not found');
  //     }
  //     mockEvents.splice(eventIndex, 1);
  //     return;
  //   }

  //   const response = await fetch(`${API_BASE_URL}/events/${id}`, {
  //     method: 'DELETE',
  //   });
  //   if (!response.ok) {
  //     const error: ApiError = await response.json();
  //     throw new Error(error.message || 'Failed to delete event');
  //   }
  // }

  // async registerForEvent(eventId: number, userId: number): Promise<void> {
  //   if (USE_MOCK_DATA) {
  //     await this.simulateDelay();
  //     const event = mockEvents.find(e => e.id === eventId);
  //     if (!event) {
  //       throw new Error('Event not found');
  //     }
  //     // In a real implementation, you would update the participants count
  //     // For now, we'll just simulate success
  //     return;
  //   }

  //   const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ userId }),
  //   });
  //   if (!response.ok) {
  //     const error: ApiError = await response.json();
  //     throw new Error(error.message || 'Failed to register for event');
  //   }
  // }

  // // Additional methods for filtering and searching
  // async getEventsByStatus(status: 'ongoing' | 'upcoming' | 'past'): Promise<Event[]> {
  //   if (USE_MOCK_DATA) {
  //     await this.simulateDelay();
  //     return mockEvents.filter(event => event.status === status);
  //   }

  //   const response = await fetch(`${API_BASE_URL}/events?status=${status}`);
  //   return this.handleResponse<Event[]>(response);
  // }

  // async searchEvents(searchTerm: string): Promise<Event[]> {
  //   if (USE_MOCK_DATA) {
  //     await this.simulateDelay();
  //     const term = searchTerm.toLowerCase();
  //     return mockEvents.filter(event =>
  //       event.title.toLowerCase().includes(term) ||
  //       event.address.toLowerCase().includes(term) ||
  //       event.requirements?.toLowerCase().includes(term)
  //     );
  //   }

  //   const response = await fetch(`${API_BASE_URL}/events/search?q=${encodeURIComponent(searchTerm)}`);
  //   return this.handleResponse<Event[]>(response);
  // }
}

export const eventService = new EventService();
