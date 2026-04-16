import { TaskModel, ITask, TaskPriority, TaskStatus } from '../models/Task';
import { UserModel, IUser } from '../models/User';
import { ProjectModel, IProject } from '../models/Project';

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
        return await TaskModel.findByIdAndUpdate(
            taskId,
            { status: TaskStatus.COMPLETED },
            { new: true }
        );
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