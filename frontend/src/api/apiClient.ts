import axios from 'axios';
import { Task, TaskPriority, TaskStatus } from '../models/types';

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
    ): Promise<Task> => {
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 7); // default deadline: 7 days from now

        const response = await axios.post<{ task: Task }>(TASKS_URL, {
            title,
            description,
            priority,
            deadline: deadline.toISOString(),
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
};
