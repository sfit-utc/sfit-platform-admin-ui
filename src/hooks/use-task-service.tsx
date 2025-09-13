import { useState, useCallback, useEffect } from "react";
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
  const [pagination, setPagination] = useState<PageListResp<Task[]> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskDetail, setTaskDetail] = useState<Task | null>(null);
  const [createdTask, setCreatedTask] = useState<Task | null>(null);
  const [deletedTaskId, setDeletedTaskId] = useState<string | null>(null);
  const [addUserTaskResult, setAddUserTaskResult] = useState<any>(null);
  const [deleteUserTaskResult, setDeleteUserTaskResult] = useState<any>(null);
  const [updateTaskUserStatusResult, setUpdateTaskUserStatusResult] = useState<any>(null);

  // List all tasks
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

  // List tasks by event ID
  const fetchTasksByEventID = useCallback(async (eventId: string, query: ListTasksByEventID) => {
    setLoading(true);
    setError(null);
    try {
      const res = await taskService.listTasksByEventID(eventId, query);
      setTasks(res.items);
      setPagination(res);
      return res;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks by event");
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
      setTaskDetail(detail);
      return detail;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch task detail");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  // Create task
    const createTask = useCallback(async (data: CreateTaskReq) => {
    setLoading(true);
    setError(null);
    try {
      const task = await taskService.createTask(data);
      setCreatedTask(task);
      return task;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update task
  const updateTask = useCallback(async (taskId: string, data: UpdateTaskReq) => {
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
  }, []);

  // Delete task
  const deleteTask = useCallback(async (taskId: string) => {
    setLoading(true);
    setError(null);
    try {
      await taskService.deleteTask(taskId);
      setDeletedTaskId(taskId);
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
      setAddUserTaskResult(result);
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
      setDeleteUserTaskResult(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user task");
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
      setUpdateTaskUserStatusResult(result);
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
    taskDetail,
    createdTask,
    deletedTaskId,
    addUserTaskResult,
    deleteUserTaskResult,
    updateTaskUserStatusResult,
    fetchTasks,
    fetchTasksByEventID,
    fetchTasksByUserID,
    fetchTaskDetail,
    createTask,
    updateTask,
    deleteTask,
    addUserTask,
    deleteUserTask,
    updateTaskUserStatus,
  };
};