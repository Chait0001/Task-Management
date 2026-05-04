export enum TaskStatus {
    PENDING = 'Pending',
    IN_PROGRESS = 'In Progress',
    COMPLETED = 'Completed',
    OVERDUE = 'Overdue'
}

export enum TaskPriority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High'
}

export interface Tag {
    _id: string;
    name: string;
    color: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    deadline: string | Date; // Depending on JSON serialization Date strings happen
    priority: TaskPriority;
    status: TaskStatus;
    tags?: Tag[];
    blockedBy?: string[]; // IDs of tasks that block this task
}
