import { Task, ApiError } from "@/types/task";
import { authService } from "./auth-service";
import { PaginatedResult, PaginationQuery } from "@/types/pagination";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
type TaskStatus = "done" | "ongoing" | "upcoming";

function getAuthHeaders(): Record<string, string> {
  const token = authService.getStoredToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}
function getTaskStatus(task: Task): TaskStatus {
  if (task.percent_complete === 100) return "done";
  if (task.percent_complete === 0) return "upcoming";
  return "ongoing";
}

class TaskService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Something went wrong");
    }
    return response.json();
  }

  // Lấy danh sách tất cả nhiệm vụ
  async getTasks(
    page = 1,
    pageSize = 10,
    name?: string,
    eventId?: string,
    isCompleted?: boolean
  ): Promise<PaginatedResult<Task>> {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
      ...(name ? { name } : {}),
      ...(eventId ? { event_id: eventId } : {}),
      ...(isCompleted !== undefined
        ? { is_completed: String(isCompleted) }
        : {}),
    });
    const response = await fetch(`${API_BASE_URL}/tasks?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    return this.handleResponse<PaginatedResult<Task>>(response);
  }

  // Lấy nhiệm vụ theo ID
  async getTaskById(id: string): Promise<Task | undefined> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      headers: getAuthHeaders(),
    });
    return this.handleResponse<Task>(response);
  }

  // Tạo nhiệm vụ mới
  async createTask(
    task: Omit<Task, "id">
  ): Promise<{ id: string; create_at: string }> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
      },
      body: JSON.stringify(task),
    });
    return this.handleResponse<{ id: string; create_at: string }>(response);
  }

  // Cập nhật nhiệm vụ
  async updateTask(
    id: string,
    updates: Partial<Task>
  ): Promise<{ id: string; update_at: string }> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    return this.handleResponse<{ id: string; update_at: string }>(response);
  }

  // Xóa nhiệm vụ
  async deleteTask(id: string): Promise<{ task_id: string }> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return this.handleResponse<{ task_id: string }>(response);
  }

  // Lấy danh sách nhiệm vụ theo sự kiện
  async getTasksByEventId(eventId: string, page = 1, pageSize = 10, isCompleted?: boolean): Promise<PaginatedResult<Task>> {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
      ...(isCompleted !== undefined ? { is_completed: String(isCompleted) } : {}),
    });
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/tasks?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    return this.handleResponse<PaginatedResult<Task>>(response);
  }

  // Lấy danh sách nhiệm vụ theo user
  async getTasksByUserId(userId: string, page = 1, pageSize = 10, isCompleted?: boolean): Promise<PaginatedResult<Task>> {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
      ...(isCompleted !== undefined ? { is_completed: String(isCompleted) } : {}),
    });
    const response = await fetch(`${API_BASE_URL}/users/${userId}/tasks?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    return this.handleResponse<PaginatedResult<Task>>(response);
  }

  // Gán nhiệm vụ cho user
  async assignTaskToUser(
    userId: string,
    taskId: string
  ): Promise<{ id: string; create_at: string }> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/tasks`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task_id: taskId }),
    });
    return this.handleResponse<{ id: string; create_at: string }>(response);
  }

  // Gỡ nhiệm vụ khỏi user
  async removeTaskFromUser(userId: string, taskId: string): Promise<boolean> {
    const response = await fetch(
      `${API_BASE_URL}/users/${userId}/tasks/${taskId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );
    await this.handleResponse(response);
    return true;
  }

  // Lấy nhiệm vụ của user theo event
  async getUserTasksByEvent(
    userId: string,
    eventId: string,
    page = 1,
    pageSize = 10
  ): Promise<PaginatedResult<Task>> {
    const params = new URLSearchParams({
      event_id: eventId,
      page: String(page),
      page_size: String(pageSize),
    });
    const response = await fetch(`${API_BASE_URL}/users/${userId}/tasks?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    return this.handleResponse<PaginatedResult<Task>>(response);
  }

  // Lấy danh sách nhiệm vụ kèm trạng thái
  async getTasksWithStatus(page = 1, pageSize = 10): Promise<(Task & { status: TaskStatus })[]> {
    const paged = await this.getTasks(page, pageSize);
    const items = paged.items ?? [];
    return items.map((task) => ({
      ...task,
      status: getTaskStatus(task),
    }));
  }
}

export const taskService = new TaskService();
