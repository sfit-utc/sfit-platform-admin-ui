import { useState, useCallback } from "react";
import { Task } from "@/types/task";
import { taskService } from "@/services/task-service";

export const useTaskService = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const createTask = useCallback(async (task: Omit<Task, "id">) => {
    setLoading(true);
    setError(null);
    try {
      const newTask = await taskService.createTask(task);
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    } catch (err: any) {
      setError(err.message || "Failed to create task");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (id: number, updates: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await taskService.updateTask(id, updates);
      setTasks((prev) =>
        prev.map((task) => (task.id === id && updated ? updated : task))
      );
      return updated;
    } catch (err: any) {
      setError(err.message || "Failed to update task");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const ok = await taskService.deleteTask(id);
      if (ok) setTasks((prev) => prev.filter((task) => task.id !== id));
      return ok;
    } catch (err: any) {
      setError(err.message || "Lỗi khi xóa task");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    // setTasks,
  };
};