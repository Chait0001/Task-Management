import { Request, Response } from 'express';
import { TaskManager } from '../services/TaskManager';
import { Task, TaskPriority, TaskStatus } from '../models/Task';

/**
 * TaskController
 * Handles HTTP requests and delegates business logic to TaskManager.
 * Keeps controller lightweight (Separation of Concerns).
 */
export class TaskController {
    private taskManager: TaskManager;

    constructor() {
        // Using Singleton pattern to maintain a single source of truth
        this.taskManager = TaskManager.getInstance();
    }

    /**
     * Create a new task
     */
    public createTask = (req: Request, res: Response): void => {
        try {
            const { title, description, deadline, priority } = req.body;

            // Basic validation
            if (!title || title.trim().length === 0) {
                res.status(400).json({ error: 'Title is required' });
                return;
            }

            const parsedDeadline = deadline ? new Date(deadline) : new Date();

            // Validate priority or fallback to MEDIUM
            const validPriority = Object.values(TaskPriority).includes(priority)
                ? priority
                : TaskPriority.MEDIUM;

            const task = this.taskManager.createTask(
                title.trim(),
                description?.trim() || "",
                parsedDeadline,
                validPriority as TaskPriority
            );

            res.status(201).json({
                message: 'Task created successfully',
                task: this.mapTaskToDTO(task)
            });

        } catch (error) {
            console.error("Error creating task:", error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    /**
     * Fetch all tasks (optionally filter by status)
     */
    /**
     * Fetch all tasks (optionally filter by status)
     */
    /**
     * Fetch all tasks (optionally filter by status)
     */
    public fetchAllTasks = (req: Request, res: Response): void => {
        try {
            const { status } = req.query;
            let tasks: Task[];

            if (status && Object.values(TaskStatus).includes(status as TaskStatus)) {
                tasks = this.taskManager.filterTasksByStatus(status as TaskStatus);
            } else {
                tasks = this.taskManager.getAllTasks();
            }

            res.status(200).json(tasks.map(task => this.mapTaskToDTO(task)));

        } catch (error) {
            console.error("Error fetching tasks:", error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    /**
     * Mark a task as complete
     */
    public completeTaskById = (req: Request, res: Response): void => {
        try {
            const { id } = req.params;

            const task = this.taskManager.completeTask(id as string);

            if (!task) {
                res.status(404).json({ error: 'Task not found' });
                return;
            }

            res.status(200).json({
                message: 'Task marked as complete',
                task: this.mapTaskToDTO(task)
            });

        } catch (error) {
            console.error("Error updating task:", error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    /**
     * Delete a task by ID
     */
    public removeTask = (req: Request, res: Response): void => {
        try {
            const { id } = req.params;

            const isDeleted = this.taskManager.deleteTask(id as string);

            if (!isDeleted) {
                res.status(404).json({ error: 'Task not found' });
                return;
            }

            res.status(200).json({
                message: 'Task deleted successfully'
            });

        } catch (error) {
            console.error("Error deleting task:", error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    /**
     * Convert Task object → DTO (safe for API response)
     */
    private mapTaskToDTO(task: Task) {
        return {
            id: task.getId(),
            title: task.getTitle(),
            description: task.getDescription(),
            deadline: task.getDeadline(),
            priority: task.getPriority(),
            status: task.getStatus()
        };
    }
}