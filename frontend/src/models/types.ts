export enum TaskStatus {
    PENDING = 'Pending',
    COMPLETED = 'Completed'
}

export enum TaskPriority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High'
}

export interface Task {
    id: string;
    title: string;
    description: string;
    deadline: string | Date; // Depending on JSON serialization Date strings happen
    priority: TaskPriority;
    status: TaskStatus;
}
