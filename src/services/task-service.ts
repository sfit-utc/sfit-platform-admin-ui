import { Task, ApiError } from "@/types/task";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const USE_MOCK_DATA = true;
type TaskStatus = "done" | "ongoing" | "upcoming";

function getTaskStatus(task: Task): TaskStatus {
  if (task.percentComplete === 100) return "done";
  if (task.percentComplete === 0) return "upcoming";
  return "ongoing";
}
const mockTasks: Task[] = [
  {
    id: 1,
    eventId: 1,
    title: "Chuẩn bị tài liệu họp",
    tags: [
      { label: "Quan trọng", color: "#ff4d4f", textColor: "#fff" },
      { label: "Họp", color: "#1890ff", textColor: "#fff" },
    ],
    description: "Chuẩn bị tài liệu cho cuộc họp tổng kết quý.",
    startDate: "01/06/2005",
    deadline: "25/05/2005",
    assignee: "Nguyễn Văn A",
    percentComplete: 60,
  },
  {
    id: 2,
    eventId: 1,
    title: "Kiểm tra thiết bị",
    tags: [{ label: "Thiết bị", color: "#52c41a", textColor: "#fff" }],
    description: "Kiểm tra toàn bộ thiết bị trước sự kiện.",
    startDate: "01/06/2005",
    deadline: "25/05/2005",
    assignee: "Trần Thị B",
    percentComplete: 30,
  },
  {
    id: 3,
    eventId: 3,
    title: "Gửi thư mời",
    tags: [{ label: "Khách mời", color: "#faad14", textColor: "#fff" }],
    description: "Gửi thư mời tham dự sự kiện cho khách mời.",
    startDate: "01/06/2005",
    deadline: "25/05/2005",
    assignee: "Lê Văn C",
    percentComplete: 100,
  },
  {
    id: 4,
    eventId: 4,
    title: "Thiết kế poster cho cuộc thi lập trình",
    tags: [{ label: "Khách mời", color: "#faad14", textColor: "#fff" }],
    description: "Thiết kế poster",
    startDate: "01/06/2005",
    deadline: "25/05/2005",
    assignee: "Lê Văn C",
    percentComplete: 0,
  },
];

class TaskService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Something went wrong");
    }
    return response.json();
  }
  private async simulateDelay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async getTasks(): Promise<Task[]> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      return [...mockTasks];
    }
    const response = await fetch(`${API_BASE_URL}/tasks`);
    return this.handleResponse<Task[]>(response);
  }
  async getTaskById(id: number): Promise<Task | undefined> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      const task = mockTasks.find((e) => e.id === id);
      if (!task) {
        throw new Error("Task not found");
      }
      return task;
    }
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
    return this.handleResponse<Task>(response);
  }
  async createTask(task: Omit<Task, "id">): Promise<Task> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      const newTask: Task = { ...task, id: mockTasks.length + 1 };
      mockTasks.push(newTask);
      return newTask;
    }
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    return this.handleResponse<Task>(response);
  }
  async updateTask(
    id: number,
    updates: Partial<Task>
  ): Promise<Task | undefined> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      const idx = mockTasks.findIndex((task) => task.id === id);
      if (idx === -1) return undefined;
      mockTasks[idx] = { ...mockTasks[idx], ...updates };
      return mockTasks[idx];
    }
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return this.handleResponse<Task>(response);
  }
  async deleteTask(id: number): Promise<boolean> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      const idx = mockTasks.findIndex((task) => task.id === id);
      if (idx === -1) return false;
      mockTasks.splice(idx, 1);
      return true;
    }
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
    });
    await this.handleResponse(response);
    return true;
  }
  async getTasksWithStatus(): Promise<(Task & { status: TaskStatus })[]> {
    const tasks = await this.getTasks();
    return tasks.map((task) => ({
      ...task,
      status: getTaskStatus(task),
    }));
  }
  async getTaskByEventId(eventId: number): Promise<Task[]> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      return mockTasks.filter((task) => task.eventId === eventId);
    }
    const response = await fetch(`${API_BASE_URL}/tasks?eventId=${eventId}`);
    return this.handleResponse<Task[]>(response);
  }
}

export const taskService = new TaskService();