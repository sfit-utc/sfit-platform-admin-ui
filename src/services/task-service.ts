import { Task, CreateTaskReq, UpdateTaskReq, ListTaskQuery, AddUserTaskReq, ListTaskOfUserReq, ListTasksByEventID, UpdateTaskUserStatusReq, ResponseTasksOfUser, ApiError } from "@/types/task";
import { PageListResp } from "@/types/pagination";
import apiClient from "@/libs/http";

type TaskStatus = "done" | "ongoing" | "upcoming";

function getTaskStatus(task: Task): TaskStatus {
  if (task.percent_complete === 100) return "done";
  if (task.percent_complete === 0) return "upcoming";
  return "ongoing";
}

class TaskService {
  async createTask(data: CreateTaskReq): Promise<Task> {
    const res = await apiClient.post<{ data: Task }>("/tasks", data);
    return res.data.data;
  }

  async getTaskDetail(taskId: string): Promise<Task> {
    const res = await apiClient.get<{ data: Task }>(`/tasks/${taskId}`);
    return res.data.data;
  }

  async updateTask(taskId: string, data: UpdateTaskReq): Promise<void> {
    await apiClient.put(`/tasks/${taskId}`, data);
  }

  async deleteTask(taskId: string): Promise<void> {
    await apiClient.delete(`/tasks/${taskId}`);
  }

  async getTasks(query: ListTaskQuery): Promise<PageListResp<Task[]>> {
    const res = await apiClient.get<{ data: PageListResp<Task[]> }>("/tasks", { params: query });
    return res.data.data;
  }

  async listTasksByEventID(eventId: string, query: ListTasksByEventID): Promise<PageListResp<Task[]>> {
    const res = await apiClient.get<{ data: PageListResp<Task[]> }>(`/events/${eventId}/tasks`, { params: query });
    return res.data.data;
  }

  async listTasksByUserID(userId: string, query: ListTaskOfUserReq): Promise<PageListResp<ResponseTasksOfUser[]>> {
    const res = await apiClient.get<{ data: PageListResp<ResponseTasksOfUser[]> }>(`/tasks/user/${userId}`, { params: query });
    return res.data.data;
  }

  async addUserTask(userId: string, data: AddUserTaskReq): Promise<void> {
    await apiClient.post(`/tasks/user/${userId}`, data);
  }

  async deleteUserTask(userId: string, taskId: string): Promise<void> {
    await apiClient.delete(`/tasks/user/${userId}/${taskId}`);
  }

  async updateTaskUserStatus(userId: string, taskId: string, data: UpdateTaskUserStatusReq): Promise<void> {
    await apiClient.put(`/tasks/user/${userId}/${taskId}`, data);
  }
  // async getTaskByStatus(query: ListTaskQuery, status: "done" | "ongoing" | "upcoming"): Promise<PageListResp<Task[]>> {
  //   const res = await this.getTasks(query);
  //   const filteredItems = res.items.filter(task => {
  //     if (status === "done") return task.percent_complete === 100;
  //     if (status === "upcoming") return task.percent_complete === 0;
  //     return task.percent_complete > 0 && task.percent_complete < 100;
  //   });
  //   return {
  //     ...res,
  //     items: filteredItems
  //   };
  // }

}

export const taskService = new TaskService();