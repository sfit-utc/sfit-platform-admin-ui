import { Task, CreateTaskReq, UpdateTaskReq, ListTaskQuery, AddUserTaskReq, ListTaskOfUserReq, ListTasksByEventID, UpdateTaskUserStatusReq, ResponseTasksOfUser, ApiError } from "@/types/task";
import { PageListResp } from "@/types/pagination";
import apiClient from "@/libs/http";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
type TaskStatus = "done" | "ongoing" | "upcoming";

function getTaskStatus(task: Task): TaskStatus {
  if (task.percent_complete === 100) return "done";
  if (task.percent_complete === 0) return "upcoming";
  return "ongoing";
}

class TaskService {
  // Helper method for handling fetch responses
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Create task (apiClient version)
  async createTask(data: CreateTaskReq): Promise<Task> {
    // const res = await apiClient.post<{ data: Task }>("/tasks", data);
    // return res.data;
    const res = await apiClient.post("/tasks", data);
    return res.data;
  }

  // Get task detail
  async getTaskDetail(taskId: string): Promise<Task> {
    const res = await apiClient.get<{ data: Task }>(`/tasks/${taskId}`);
    return res.data.data;
  }

  // Get task by ID (fetch version)
  async getTaskById(id: string): Promise<Task | undefined> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
    return this.handleResponse<Task>(response);
  }

  // Update task (apiClient version)
  async updateTask(taskId: string, data: UpdateTaskReq): Promise<void> {
    await apiClient.put(`/tasks/${taskId}`, data);
  }

  async deleteTask(taskId: string): Promise< {message: string} > {
    await apiClient.delete(`/tasks/${taskId}`);
    return { message: "Deleted successfully" };
  }

  // Get tasks with pagination (apiClient version)
  async getTasks(query: ListTaskQuery): Promise<PageListResp<Task[]>> {
    const res = await apiClient.get<{ data: PageListResp<Task[]> }>("/tasks", { params: query });
    return res.data.data;
  }

  // Get all tasks (fetch version)
  async getAllTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    return this.handleResponse<Task[]>(response);
  }

  // List tasks by event ID (apiClient version)
  async listTasksByEventID(eventId: string, query: ListTasksByEventID): Promise<PageListResp<Task[]>> {
    const res = await apiClient.get<{ data: PageListResp<Task[]> }>(`/events/${eventId}/tasks`, { params: query });
    return res.data.data;
  }

  // Get tasks by event ID (fetch version)
  async getTasksByEventId(eventId: string): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/tasks`);
    return this.handleResponse<Task[]>(response);
  }

  // List tasks by user ID (apiClient version)
  async listTasksByUserID(userId: string, query: ListTaskOfUserReq): Promise<PageListResp<ResponseTasksOfUser[]>> {
    const res = await apiClient.get<{ data: PageListResp<ResponseTasksOfUser[]> }>(`/tasks/user/${userId}`, { params: query });
    return res.data.data;
  }

  // Get tasks by user ID (fetch version)
  async getTasksByUserId(userId: string): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/tasks`);
    return this.handleResponse<Task[]>(response);
  }

  // Add user task (apiClient version)
  async addUserTask(userId: string, data: AddUserTaskReq): Promise<void> {
    await apiClient.post(`/tasks/user/${userId}`, data);
  }

  // Assign task to user (fetch version)
  async assignTaskToUser(userId: string, taskId: string): Promise<{ id: string; create_at: string }> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task_id: taskId }),
    });
    return this.handleResponse<{ id: string; create_at: string }>(response);
  }

  // Delete user task (apiClient version)
  async deleteUserTask(userId: string, taskId: string): Promise<void> {
    await apiClient.delete(`/tasks/user/${userId}/${taskId}`);
  }

  // Remove task from user (fetch version)
  async removeTaskFromUser(userId: string, taskId: string): Promise<boolean> {
    const response = await fetch(
      `${API_BASE_URL}/users/${userId}/tasks/${taskId}`,
      {
        method: "DELETE",
      }
    );
    await this.handleResponse(response);
    return true;
  }

  // Update user task status (apiClient version)
  async updateTaskUserStatus(userId: string, taskId: string, data: UpdateTaskUserStatusReq): Promise<void> {
    await apiClient.put(`/tasks/user/${userId}/${taskId}`, data);
  }

  // Get user tasks by event
  async getUserTasksByEvent(
    userId: string,
    eventId: string,
    page?: number,
    pageSize?: number
  ): Promise<Task[]> {
    let url = `${API_BASE_URL}/users/${userId}/tasks?event_id=${eventId}`;
    if (page !== undefined && pageSize !== undefined) {
      url += `&page=${page}&page_size=${pageSize}`;
    }
    const response = await fetch(url);
    return this.handleResponse<Task[]>(response);
  }

  // Get tasks with status
  async getTasksWithStatus(): Promise<(Task & { status: TaskStatus })[]> {
    const tasks = await this.getAllTasks();
    return tasks.map((task) => ({
      ...task,
      status: getTaskStatus(task),
    }));
  }
}

export const taskService = new TaskService();
