import axios from 'axios';
import { Task, TaskPriority, TaskStatus, Tag } from '../models/types';

/**
 * Base API URL resolution:
 * - In development:  Vite dev server proxies /api  →  http://localhost:4000/api
 * - In production (Vercel): VITE_API_URL must be set to the full backend URL
 *   e.g.  VITE_API_URL=https://your-backend.vercel.app/api
 *
 * The trailing /tasks path is appended per-method so we keep the base clean.
 */
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';
const TASKS_URL = `${API_BASE}/tasks`;

/**
 * Service to encapsulate all external HTTP calls to the backend.
 */
export const apiClient = {
    getAllTasks: async (status?: TaskStatus): Promise<Task[]> => {
        const response = await axios.get<Task[]>(TASKS_URL, {
            params: status ? { status } : undefined,
        });
        return response.data;
    },

    createTask: async (
        title: string,
        description: string,
        priority: TaskPriority,
        deadlineStr: string
    ): Promise<Task> => {
        const response = await axios.post<{ task: Task }>(TASKS_URL, {
            title,
            description,
            priority,
            deadline: deadlineStr,
        });
        return response.data.task;
    },

    markTaskComplete: async (id: string): Promise<Task> => {
        const response = await axios.patch<{ task: Task }>(`${TASKS_URL}/${id}/complete`);
        return response.data.task;
    },

    deleteTask: async (id: string): Promise<void> => {
        await axios.delete(`${TASKS_URL}/${id}`);
    },

    updateTask: async (id: string, data: Partial<{ title: string; description: string; priority: TaskPriority; deadline: string }>): Promise<Task> => {
        const response = await axios.put<{ task: Task }>(`${TASKS_URL}/${id}`, data);
        return response.data.task;
    },

    updateTaskStatus: async (id: string, status: TaskStatus): Promise<Task> => {
        const response = await axios.patch<{ task: Task }>(`${TASKS_URL}/${id}/status`, { status });
        return response.data.task;
    },

    getStats: async (): Promise<{ total: number; completed: number; pending: number; inProgress: number; overdue: number }> => {
        const response = await axios.get(`${API_BASE}/stats`);
        return response.data;
    },

    getProjects: async (): Promise<{ _id: string; name: string }[]> => {
        const response = await axios.get(`${API_BASE}/projects`);
        return response.data;
    },

    getTags: async (): Promise<Tag[]> => {
        const res = await axios.get(`${API_BASE}/tags`);
        return res.data;
    },

    // Focus API
    startFocusSession: async (taskId: string, durationMinutes: number = 25) => {
        const res = await axios.post(`${API_BASE}/focus/start`, { taskId, durationMinutes });
        return res.data;
    },
    completeFocusSession: async (sessionId: string) => {
        const res = await axios.patch(`${API_BASE}/focus/${sessionId}/complete`);
        return res.data;
    },
    abandonFocusSession: async (sessionId: string) => {
        const res = await axios.patch(`${API_BASE}/focus/${sessionId}/abandon`);
        return res.data;
    },
    getTaskPomodoros: async (taskId: string): Promise<number> => {
        const res = await axios.get(`${API_BASE}/focus/task/${taskId}/pomodoros`);
        return res.data.count;
    },
    getProductivityScore: async (): Promise<number> => {
        const res = await axios.get(`${API_BASE}/focus/productivity`);
        return res.data.score;
    },

    // Dependency API
    addDependency: async (taskId: string, blockedById: string): Promise<Task> => {
        const res = await axios.post(`${API_BASE}/tasks/${taskId}/dependencies`, { blockedById });
        return res.data;
    },
    removeDependency: async (taskId: string, blockedById: string): Promise<Task> => {
        const res = await axios.delete(`${API_BASE}/tasks/${taskId}/dependencies`, { data: { blockedById } });
        return res.data;
    }
};
