import { useState, useEffect, useCallback } from 'react';
import { Task, Priority } from '../types/task';
import { useAuth } from '../contexts/AuthContext';

interface UseTaskApiReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (data: { title: string; description?: string; priority: Priority }) => Promise<void>;
  updateTask: (id: string, data: { title: string; description?: string; priority: Priority }) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteCompleted: () => Promise<void>;
  refreshTasks: () => Promise<void>;
}

const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

export const useTaskApi = (filter: { completed?: boolean; priority?: Priority } = {}): UseTaskApiReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuthenticated } = useAuth();

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  });

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setTasks([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (filter.completed !== undefined) {
        params.append('completed', filter.completed.toString());
      }
      if (filter.priority) {
        params.append('priority', filter.priority);
      }

      const response = await fetch(`${API_BASE}/tasks?${params}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      }

      const data = await response.json();
      setTasks(data.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [filter, isAuthenticated, token]);

  const createTask = async (data: { title: string; description?: string; priority: Priority }) => {
    if (!isAuthenticated || !token) {
      throw new Error('Authentication required');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create task');
      }

      await fetchTasks(); // Refresh tasks
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string, data: { title: string; description?: string; priority: Priority }) => {
    if (!isAuthenticated || !token) {
      throw new Error('Authentication required');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task');
      }

      await fetchTasks(); // Refresh tasks
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    if (!isAuthenticated || !token) {
      throw new Error('Authentication required');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete task');
      }

      await fetchTasks(); // Refresh tasks
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id: string) => {
    if (!isAuthenticated || !token) {
      throw new Error('Authentication required');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/tasks/${id}/toggle`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to toggle task');
      }

      await fetchTasks(); // Refresh tasks
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCompleted = async () => {
    if (!isAuthenticated || !token) {
      throw new Error('Authentication required');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete completed tasks');
      }

      await fetchTasks(); // Refresh tasks
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete completed tasks');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [fetchTasks, isAuthenticated]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    deleteCompleted,
    refreshTasks: fetchTasks,
  };
};