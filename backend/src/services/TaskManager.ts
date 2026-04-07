import { Task, TaskPriority, TaskStatus } from '../models/Task';
import { User } from '../models/User';
import { Project } from '../models/Project';

export class TaskManager {
    private static instance: TaskManager;

    private users: Map<string, User> = new Map();
    private tasks: Map<string, Task> = new Map();
    private projects: Map<string, Project> = new Map();

    private constructor() {
        this.createProject("1", "Default Workspace");
    }

    public static getInstance(): TaskManager {
        if (!TaskManager.instance) {
            TaskManager.instance = new TaskManager();
        }
        return TaskManager.instance;
    }

    // ---------------- TASK OPERATIONS ----------------

    public createTask(
        title: string,
        description: string,
        deadline: Date,
        priority: TaskPriority
    ): Task {
        const id = Date.now().toString();

        const newTask = new Task(id, title, description, deadline, priority);

        this.tasks.set(id, newTask);

        const defaultProject = this.projects.get("1");
        if (defaultProject) {
            defaultProject.addTask(newTask);
        }

        return newTask;
    }

    public getTaskById(taskId: string): Task | undefined {
        return this.tasks.get(taskId);
    }

    public getAllTasks(): Task[] {
        return Array.from(this.tasks.values());
    }

    public filterTasksByStatus(status: TaskStatus): Task[] {
        return this.getAllTasks().filter(task => task.getStatus() === status);
    }

    public completeTask(taskId: string): Task | undefined {
        const task = this.tasks.get(taskId);

        if (!task) return undefined;

        task.markAsComplete();
        return task;
    }

    public deleteTask(taskId: string): boolean {
        if (!this.tasks.has(taskId)) return false;

        this.tasks.delete(taskId);

        const defaultProject = this.projects.get("1");
        if (defaultProject) {
            defaultProject.removeTaskById(taskId);
        }

        return true;
    }

    // ---------------- EXTRA FEATURE ----------------

    public updateOverdueTasks(): void {
        this.tasks.forEach(task => {
            task.updateStatusBasedOnDeadline();
        });
    }

    // ---------------- PROJECT OPERATIONS ----------------

    public createProject(projectId: string, name: string): Project {
        const project = new Project(projectId, name);
        this.projects.set(projectId, project);
        return project;
    }

    public getProjectById(projectId: string): Project | undefined {
        return this.projects.get(projectId);
    }
}