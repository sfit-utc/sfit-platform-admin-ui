import { useState, useCallback} from "react";
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
} from "@/types/task";
import { PageListResp } from "@/types/pagination";
import { taskService } from "@/services/task-service";

export const useTaskService = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userTasks, setUserTasks] = useState<ResponseTasksOfUser[]>([]);
  const [pagination, setPagination] = useState<PageListResp<Task[]> | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // List all tasks with pagination
  const fetchTasks = useCallback(async (query: ListTaskQuery) => {
    setLoading(true);
    setError(null);
    try {
      const res = await taskService.getTasks(query);
      setTasks(res.items);
      setPagination(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all tasks without pagination
  const fetchAllTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tasks = await taskService.getAllTasks();
      setTasks(tasks);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch all tasks"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // List tasks by event ID with pagination
  const fetchTasksByEventID = useCallback(
    async (eventId: string, query: ListTasksByEventID) => {
      setLoading(true);
      setError(null);
      try {
        const res = await taskService.listTasksByEventID(eventId, query);
        setTasks(res.items);
        setPagination(res);
        return res;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch tasks by event"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Get tasks by event ID without pagination
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

  // List tasks by user ID
  const fetchTasksByUserID = useCallback(async (userId: string, query: ListTaskOfUserReq) => {
    setLoading(true);
    setError(null);
    try {
      const res = await taskService.listTasksByUserID(userId, query);
      setUserTasks(res.items);
      // Optionally set pagination if needed
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  // Get task detail
  const fetchTaskDetail = useCallback(async (taskId: string) => {
    setLoading(true);
    setError(null);
    try {
      const detail = await taskService.getTaskDetail(taskId);
      return detail;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch task detail"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get task by ID
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

  // Get user tasks by event
  const fetchUserTasksByEvent = useCallback(
    async (
      userId: string,
      eventId: string,
      page?: number,
      pageSize?: number
    ) => {
      setLoading(true);
      setError(null);
      try {
        return await taskService.getUserTasksByEvent(
          userId,
          eventId,
          page,
          pageSize
        );
      } catch (err: any) {
        setError(err.message || "Failed to fetch user tasks by event");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Get tasks with status
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

  // Create task (apiClient version)
  const createTask = useCallback(async (data: CreateTaskReq) => {
    setLoading(true);
    setError(null);
    try {
      const task = await taskService.createTask(data);
      return task;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update task (apiClient version)
  const updateTask = useCallback(
    async (taskId: string, data: UpdateTaskReq) => {
      setLoading(true);
      setError(null);
      try {
        await taskService.updateTask(taskId, data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update task");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );
  // Delete task
  // const deleteTaskWithClient = useCallback(async (taskId: string) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     await taskService.deleteTask(taskId);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "Failed to delete task");
  //     throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // Gán nhiệm vụ cho user
  const assignTaskToUser = useCallback(
    async (userId: string, taskId: string) => {
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
    },
    []
  );

  // Gỡ nhiệm vụ khỏi user
  const removeTaskFromUser = useCallback(
    async (userId: string, taskId: string) => {
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
    },
    []
  );

  // Delete task
  const deleteTask = useCallback(async (taskId: string) => {
    setLoading(true);
    setError(null);
    try {
      await taskService.deleteTask(taskId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add user task
  const addUserTask = useCallback(async (userId: string, data: AddUserTaskReq) => {
    setLoading(true);
    setError(null);
    try {
      const result = await taskService.addUserTask(userId, data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add user task");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete user task
  const deleteUserTask = useCallback(async (userId: string, taskId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await taskService.deleteUserTask(userId, taskId);
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete user task"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user task status
  const updateTaskUserStatus = useCallback(async (userId: string, taskId: string, data: UpdateTaskUserStatusReq) => {
    setLoading(true);
    setError(null);
    try {
      const result = await taskService.updateTaskUserStatus(userId, taskId, data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user task status");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    tasks,
    userTasks,
    pagination,
    loading,
    error,
    fetchTasks,
    fetchAllTasks,
    fetchTasksByEventID,
    fetchTasksByEventId,
    fetchTasksByUserID,
    fetchTaskDetail,
    fetchTaskById,
    fetchUserTasksByEvent,
    fetchTasksWithStatus,
    createTask,
    updateTask,
    deleteTask,
    addUserTask,
    deleteUserTask,
    updateTaskUserStatus,
    assignTaskToUser,
    removeTaskFromUser,
  };
};
