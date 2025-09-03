import { Event, ApiError } from "@/types/event";
import { PaginatedResult, PaginationQuery } from "@/types/pagination";
import { authService } from "./auth-service";
import apiClient from "@/libs/http";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getAuthHeaders(): Record<string, string> {
  const token = authService.getStoredToken();
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }
  return { "Content-Type": "application/json" };
}

class EventService {

   private handleError(error: any): never {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Something went wrong");
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let error: ApiError;
      try {
        error = await response.json();
      } catch {
        throw new Error("Something went wrong");
      }
      throw new Error(error.message || "Something went wrong");
    }
    return response.json();
  }

  // Lấy danh sách sự kiện 
   async getEvents(
    page = 1,
    pageSize = 10,
    title?: string,
    type?: string,
    status?: string,
    onlyRegisted?: boolean,
    userId?: string
  ): Promise<PaginatedResult<Event>> {
    try {
      const params = {
        page,
        page_size: pageSize,
        ...(title ? { title } : {}),
        ...(type ? { type } : {}),
        ...(status ? { status } : {}),
        ...(onlyRegisted !== undefined ? { only_registed: onlyRegisted } : {}),
        ...(userId ? { user_id: userId } : {}),
      };
      const res = await apiClient.get<PaginatedResult<Event>>("/events", { params });
      return res.data;
    } catch (error) {
      this.handleError(error);
    }
  }


  // Lấy chi tiết sự kiện theo ID
  async getEventById(id: string): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      headers: getAuthHeaders(),
    });
    return this.handleResponse<Event>(response);
  }

  // Tạo sự kiện mới
  async createEvent(
    event: Omit<Event, "id" | "createdAt" | "updatedAt">
  ): Promise<{ id: string; createdAt: string }> {
    const payload = {
      ...event,
      max_people: event.maxPeople,
      begin_at: event.beginAt,
      end_at: event.endAt,
    };

    const response = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse<{ id: string; createdAt: string }>(response);
  }

  // Cập nhật sự kiện
  async updateEvent(
    id: string,
    updates: Partial<Event>
  ): Promise<{ id: string; updatedAt: string }> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return this.handleResponse<{ id: string; updatedAt: string }>(response);
  }

  // Xóa sự kiện
  async deleteEvent(id: string): Promise<{ id: string }> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return this.handleResponse<{ id: string }>(response);
  }

  // Đăng ký tham gia sự kiện
  async registerForEvent(
    eventId: string,
    userId: string
  ): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ user_id: userId }),
    });
    return this.handleResponse<{ success: boolean }>(response);
  }

  // Lấy danh sách user đã đăng ký sự kiện
  async getUsersInEvent(
    eventId: string,
    page = 1,
    pageSize = 10,
    status?: string
  ): Promise<PaginatedResult<{ id: string; username: string; email: string }>> {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
      ...(status ? { status } : {}),
    });
    const response = await fetch(
      `${API_BASE_URL}/events/${eventId}/users?${params.toString()}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return this.handleResponse<
      PaginatedResult<{ id: string; username: string; email: string }>
    >(response);
  }
}

export const eventService = new EventService();
