import { useState, useCallback } from "react";
import { Task } from "@/types/task";
import { taskService } from "@/services/task-service";

export const useTaskService = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy tất cả nhiệm vụ
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, []);

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

  // Lấy nhiệm vụ theo sự kiện
  const fetchTasksByEventId = useCallback(async (eventId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await taskService.getTasksByEventId(eventId);
    } catch (err: any) {
      setError(err.message || "Failed to fetch tasks by event");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy nhiệm vụ theo user
  const fetchTasksByUserId = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await taskService.getTasksByUserId(userId);
    } catch (err: any) {
      setError(err.message || "Failed to fetch tasks by user");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy nhiệm vụ của user theo event
  const fetchUserTasksByEvent = useCallback(
    async (userId: string, eventId: string, page?: number, pageSize?: number) => {
      setLoading(true);
      setError(null);
      try {
        return await taskService.getUserTasksByEvent(userId, eventId, page, pageSize);
      } catch (err: any) {
        setError(err.message || "Failed to fetch user tasks by event");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Lấy danh sách nhiệm vụ kèm trạng thái
  const fetchTasksWithStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await taskService.getTasksWithStatus();
    } catch (err: any) {
      setError(err.message || "Failed to fetch tasks with status");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Tạo nhiệm vụ mới
  const createTask = useCallback(async (task: Omit<Task, "id">) => {
    setLoading(true);
    setError(null);
    try {
      const res = await taskService.createTask(task);
      await fetchTasks();
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to create task");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTasks]);

  // Cập nhật nhiệm vụ
  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await taskService.updateTask(id, updates);
      await fetchTasks();
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to update task");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTasks]);

  // Xóa nhiệm vụ
  const deleteTask = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await taskService.deleteTask(id);
      await fetchTasks();
      return res;
    } catch (err: any) {
      setError(err.message || "Lỗi khi xóa task");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTasks]);

  // Gán nhiệm vụ cho user
  const assignTaskToUser = useCallback(async (userId: string, taskId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await taskService.assignTaskToUser(userId, taskId);
    } catch (err: any) {
      setError(err.message || "Failed to assign task to user");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Gỡ nhiệm vụ khỏi user
  const removeTaskFromUser = useCallback(async (userId: string, taskId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await taskService.removeTaskFromUser(userId, taskId);
    } catch (err: any) {
      setError(err.message || "Failed to remove task from user");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    setTasks,
    fetchTasks,
    fetchTaskById,
    fetchTasksByEventId,
    fetchTasksByUserId,
    fetchUserTasksByEvent,
    fetchTasksWithStatus,
    createTask,
    updateTask,
    deleteTask,
    assignTaskToUser,
    removeTaskFromUser,
  };
};