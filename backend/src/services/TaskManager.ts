import { TaskModel, ITask, TaskPriority, TaskStatus } from '../models/Task';
import { ProjectModel, IProject } from '../models/Project';
import { NotificationService } from './NotificationService';

export class TaskManager {
    private static instance: TaskManager;

    private constructor() {
        // We'll initialize any defaults in the database connection phase if needed.
    }

    public static getInstance(): TaskManager {
        if (!TaskManager.instance) {
            TaskManager.instance = new TaskManager();
        }
        return TaskManager.instance;
    }

    // ---------------- TASK OPERATIONS ----------------

    public async createTask(
        title: string,
        description: string,
        deadline: Date,
        priority: TaskPriority
    ): Promise<ITask> {
        const newTask = new TaskModel({
            title,
            description,
            deadline,
            priority,
            status: TaskStatus.PENDING
        });

        await newTask.save();

        // In this simple MVP, we assume a default project always exists or we create it on the fly.
        let defaultProject = await ProjectModel.findOne({ name: 'Default Workspace' });
        if (!defaultProject) {
            defaultProject = new ProjectModel({ name: 'Default Workspace' });
        }
        
        defaultProject.tasks.push(newTask._id as any);
        await defaultProject.save();

        NotificationService.getInstance().notify(newTask._id.toString(), 'Task created');

        return newTask;
    }

    public async getTaskById(taskId: string): Promise<ITask | null> {
        return await TaskModel.findById(taskId);
    }

    public async getAllTasks(): Promise<ITask[]> {
        return await TaskModel.find().sort({ createdAt: -1 });
    }

    public async filterTasksByStatus(status: TaskStatus): Promise<ITask[]> {
        return await TaskModel.find({ status }).sort({ createdAt: -1 });
    }

    public async completeTask(taskId: string): Promise<ITask | null> {
        const task = await TaskModel.findByIdAndUpdate(
            taskId,
            { status: TaskStatus.COMPLETED },
            { new: true }
        );
        if (task) {
            NotificationService.getInstance().notify(taskId, 'Task completed');
        }
        return task;
    }

    public async deleteTask(taskId: string): Promise<boolean> {
        const result = await TaskModel.findByIdAndDelete(taskId);
        if (!result) return false;

        // Cleanup project references
        await ProjectModel.updateMany(
            { tasks: taskId },
            { $pull: { tasks: taskId } }
        );

        return true;
    }

    public async updateTask(
        taskId: string,
        updates: Partial<Pick<ITask, 'title' | 'description' | 'deadline' | 'priority'>>
    ): Promise<ITask | null> {
        return await TaskModel.findByIdAndUpdate(taskId, updates, { new: true, runValidators: true });
    }

    public async getStats(): Promise<{ total: number; completed: number; pending: number; inProgress: number; overdue: number }> {
        const [total, completed, pending, inProgress, overdue] = await Promise.all([
            TaskModel.countDocuments(),
            TaskModel.countDocuments({ status: TaskStatus.COMPLETED }),
            TaskModel.countDocuments({ status: TaskStatus.PENDING }),
            TaskModel.countDocuments({ status: TaskStatus.IN_PROGRESS }),
            TaskModel.countDocuments({ status: TaskStatus.OVERDUE }),
        ]);
        return { total, completed, pending, inProgress, overdue };
    }

    // ---------------- PROJECT OPERATIONS ----------------

    public async createProject(name: string): Promise<IProject> {
        const project = new ProjectModel({ name });
        await project.save();
        return project;
    }

    public async getProjectById(projectId: string): Promise<IProject | null> {
        return await ProjectModel.findById(projectId);
    }
}