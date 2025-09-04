import { useState, useCallback } from "react";
import { Task } from "@/types/task";
import { taskService } from "@/services/task-service";
import { PageListQuery, PageListResp } from "@/types/pagination";

export const useTaskService = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy tất cả nhiệm vụ (có phân trang)
  const fetchTasks = useCallback(
    async (query: PageListQuery = { page: 1, page_size: 10 }) => {
      setLoading(true);
      setError(null);
      try {
        const data: PageListResp<Task[]> = await taskService.getTasks(query);
        setTasks(data.items);
        return data;
      } catch (err: any) {
        setError(err.message || "Failed to fetch tasks");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Lấy nhiệm vụ theo ID
  const fetchTaskById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await taskService.getTaskById(id);
    } catch (err: any) {
      setError(err.message || "Failed to fetch task by id");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy nhiệm vụ theo sự kiện (có phân trang)
  const fetchTasksByEventId = useCallback(
    async (eventId: string, query: any = { page: 1, page_size: 10 }) => {
      setLoading(true);
      setError(null);
      try {
        return await taskService.listTasksByEventId(eventId, query);
      } catch (err: any) {
        setError(err.message || "Failed to fetch tasks by event");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Lấy nhiệm vụ theo user (có phân trang)
  const fetchTasksByUserId = useCallback(
    async (userId: string, query: any = { page: 1, page_size: 10 }) => {
      setLoading(true);
      setError(null);
      try {
        return await taskService.listTasksByUserId(userId, query);
      } catch (err: any) {
        setError(err.message || "Failed to fetch tasks by user");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Tạo nhiệm vụ mới
  const createTask = useCallback(
    async (task: Omit<Task, "id">) => {
      setLoading(true);
      setError(null);
      try {
        const res = await taskService.createTask(task as any);
        await fetchTasks();
        return res;
      } catch (err: any) {
        setError(err.message || "Failed to create task");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchTasks]
  );

  // Cập nhật nhiệm vụ
  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      setLoading(true);
      setError(null);
      try {
        await taskService.updateTask(id, updates as any);
        await fetchTasks();
      } catch (err: any) {
        setError(err.message || "Failed to update task");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchTasks]
  );

  // Xóa nhiệm vụ
  const deleteTask = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await taskService.deleteTask(id);
        await fetchTasks();
      } catch (err: any) {
        setError(err.message || "Lỗi khi xóa task");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchTasks]
  );

  // Gán nhiệm vụ cho user
  const assignTaskToUser = useCallback(
    async (userId: string, taskId: string) => {
      setLoading(true);
      setError(null);
      try {
        await taskService.addUserTask(userId, { task_id: taskId });
      } catch (err: any) {
        setError(err.message || "Failed to assign task to user");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Gỡ nhiệm vụ khỏi user
  const removeTaskFromUser = useCallback(
    async (userId: string, taskId: string) => {
      setLoading(true);
      setError(null);
      try {
        await taskService.deleteUserTask(userId, taskId);
      } catch (err: any) {
        setError(err.message || "Failed to remove task from user");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );
    // Lấy tất cả nhiệm vụ kèm trạng thái
  const fetchTasksWithStatus = useCallback(
    async (query: PageListQuery = { page: 1, page_size: 10 }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await taskService.getTasksWithStatus(query);
        return data;
      } catch (err: any) {
        setError(err.message || "Failed to fetch tasks with status");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );


  return {
    tasks,
    loading,
    error,
    setTasks,
    fetchTasks,
    fetchTaskById,
    fetchTasksByEventId,
    fetchTasksByUserId,
    createTask,
    updateTask,
    deleteTask,
    assignTaskToUser,
    removeTaskFromUser,
    fetchTasksWithStatus,
  };
};