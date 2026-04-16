import axios from 'axios';
import { Task, TaskPriority, TaskStatus } from '../models/types';

const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:4000/api/tasks' 
    : '/_backend/api/tasks';

/**
 * Service to encapsulate external HTTP calls
 */
export const apiClient = {
    getAllTasks: async (status?: TaskStatus): Promise<Task[]> => {
        const response = await axios.get(API_URL, { params: { status } });
        return response.data;
    },

    createTask: async (title: string, description: string, priority: TaskPriority): Promise<Task> => {
        // Send a simple implementation for deadline in our MVP
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 7); // Adds 7 days into future
        
        const response = await axios.post(API_URL, { title, description, priority, deadline });
        return response.data.task;
    },

    markTaskComplete: async (id: string): Promise<Task> => {
        const response = await axios.patch(`${API_URL}/${id}/complete`);
        return response.data.task;
    },

    deleteTask: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`);
    }
}
