export enum TaskStatus {
    PENDING = 'Pending',
    COMPLETED = 'Completed',
    OVERDUE = 'Overdue' // Added for extra feature
}

export enum TaskPriority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High'
}

/**
 * Task Entity
 * Represents a real-world task with properties and behaviors.
 * Demonstrates encapsulation and controlled state changes.
 */
export class Task {
    private id: string;
    private title: string;
    private description: string;
    private deadline: Date;
    private priority: TaskPriority;
    private status: TaskStatus;

    constructor(
        id: string,
        title: string,
        description: string,
        deadline: Date,
        priority: TaskPriority = TaskPriority.MEDIUM
    ) {
        this.id = id;
        this.title = title.trim();
        this.description = description.trim();
        this.deadline = deadline;
        this.priority = priority;
        this.status = TaskStatus.PENDING;
    }

    /**
     * Mark task as completed
     */
    public markAsComplete(): void {
        this.status = TaskStatus.COMPLETED;
    }

    /**
     * Check and update overdue status
     */
    public updateStatusBasedOnDeadline(): void {
        if (this.status !== TaskStatus.COMPLETED && this.deadline < new Date()) {
            this.status = TaskStatus.OVERDUE;
        }
    }

    /**
     * Update task details
     */
    public updateDetails(title: string, description: string, deadline: Date): void {
        this.title = title.trim();
        this.description = description.trim();
        this.deadline = deadline;
    }

    /**
     * Change priority of task
     */
    public changePriority(priority: TaskPriority): void {
        this.priority = priority;
    }

    // Getters (Encapsulation)
    public getId(): string {
        return this.id;
    }

    public getTitle(): string {
        return this.title;
    }

    public getDescription(): string {
        return this.description;
    }

    public getDeadline(): Date {
        return this.deadline;
    }

    public getPriority(): TaskPriority {
        return this.priority;
    }

    public getStatus(): TaskStatus {
        return this.status;
    }
}