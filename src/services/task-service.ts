import apiClient from "@/libs/http";
import {
  Task,
  CreateTaskReq,
  UpdateTaskReq,
  ListTaskQuery,
  AddUserTaskReq,
  ListTaskOfUserReq,
  ListTasksByEventID,
  UpdateTaskUserStatusReq,
  ResponseTasksOfUser,
  ApiError,
} from "@/types/task";
import { PageListResp } from "@/types/pagination";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
type TaskStatus = "done" | "ongoing" | "upcoming";

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
  // Lấy danh sách nhiệm vụ kèm trạng thái
  async getTasksWithStatus(query: ListTaskQuery): Promise<(Task & { status: TaskStatus })[]> {
    const resp = await this.getTasks(query);
    return resp.items.map((task) => ({
      ...task,
      status: getTaskStatus(task),
    }));
  }

  // Lấy danh sách tất cả nhiệm vụ
  async getTasks(query: ListTaskQuery = { page: 1, page_size: 10 }): Promise<PageListResp<Task[]>> {
    const { data } = await apiClient.get(`${API_BASE_URL}/tasks`, {
      params: query,
    });
    return data;
  }

  // Tạo nhiệm vụ mới
  async createTask(req: CreateTaskReq): Promise<Task> {
    const { data } = await apiClient.post(`${API_BASE_URL}/tasks`, req);
    return data;
  }

  // Lấy chi tiết nhiệm vụ
  async getTaskById(taskId: string): Promise<Task> {
    const { data } = await apiClient.get(`${API_BASE_URL}/tasks/${taskId}`);
    return data;
  }

  // Cập nhật nhiệm vụ
  async updateTask(taskId: string, req: UpdateTaskReq): Promise<void> {
    await apiClient.put(`${API_BASE_URL}/tasks/${taskId}`, req);
  }

  // Xóa nhiệm vụ
  async deleteTask(taskId: string): Promise<void> {
    await apiClient.delete(`${API_BASE_URL}/tasks/${taskId}`);
  }


  // Lấy danh sách nhiệm vụ theo event_id (có phân trang, filter)
  async listTasksByEventId(
    event_id: string,
    query: ListTasksByEventID
  ): Promise<PageListResp<Task[]>> {
    const { data } = await apiClient.get(
      `${API_BASE_URL}/events/${event_id}/tasks`,
      { params: query }
    );
    return data;
  }

  // Lấy danh sách nhiệm vụ của user (có phân trang, filter)
  async listTasksByUserId(
    user_id: string,
    query: ListTaskOfUserReq
  ): Promise<PageListResp<ResponseTasksOfUser[]>> {
    const { data } = await apiClient.get(
      `${API_BASE_URL}/users/${user_id}/tasks`,
      { params: query }
    );
    return data;
  }

  // Gán nhiệm vụ cho user
  async addUserTask(user_id: string, req: AddUserTaskReq): Promise<void> {
    await apiClient.post(`${API_BASE_URL}/users/${user_id}/tasks`, req);
  }

  // Gỡ nhiệm vụ khỏi user
  async deleteUserTask(user_id: string, task_id: string): Promise<void> {
    await apiClient.delete(`${API_BASE_URL}/users/${user_id}/tasks/${task_id}`);
  }

  // Cập nhật trạng thái hoàn thành của user với task
  async updateTaskUserStatus(
    user_id: string,
    task_id: string,
    req: UpdateTaskUserStatusReq
  ): Promise<void> {
    await apiClient.put(
      `${API_BASE_URL}/users/${user_id}/tasks/${task_id}/status`,
      req
    );
  }

  // Lấy danh sách nhiệm vụ kèm trạng thái
  // async getTasksWithStatus(): Promise<(Task & { status: TaskStatus })[]> {
  //   const tasks = await this.getTasks();
  //   return tasks.map((task) => ({
  //     ...task,
  //     status: getTaskStatus(task),
  //   }));
  // }
}

export const taskService = new TaskService();
