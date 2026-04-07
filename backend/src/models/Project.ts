import { Task, TaskStatus } from './Task';

/**
 * Project Entity
 * Represents a collection of tasks grouped under a single project.
 * Demonstrates aggregation (Project HAS multiple Tasks).
 */
export class Project {
    private id: string;
    private name: string;
    private tasks: Task[];

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.tasks = [];
    }

    /**
     * Add a task to the project
     */
    public addTask(task: Task): void {
        this.tasks.push(task);
    }

    /**
     * Remove a task by ID
     */
    public removeTaskById(taskId: string): boolean {
        const initialLength = this.tasks.length;
        this.tasks = this.tasks.filter(task => task.getId() !== taskId);

        return this.tasks.length < initialLength;
    }

    /**
     * Find a task inside the project
     */
    public findTaskById(taskId: string): Task | undefined {
        return this.tasks.find(task => task.getId() === taskId);
    }

    /**
     * Get all tasks (returns a copy for safety - encapsulation)
     */
    public getTasks(): Task[] {
        return [...this.tasks];
    }

    /**
     * Get total number of tasks in project
     */
    public getTaskCount(): number {
        return this.tasks.length;
    }

    /**
     * Get only completed tasks
     */
    public getCompletedTasks(): Task[] {
        return this.tasks.filter(task => task.getStatus() === TaskStatus.COMPLETED);
    }

    /**
     * Get only pending tasks
     */
    public getPendingTasks(): Task[] {
        return this.tasks.filter(task => task.getStatus() === TaskStatus.PENDING);
    }

    // Getters (Encapsulation)
    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }
}