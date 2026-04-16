import mongoose, { Schema, Document } from 'mongoose';

export enum TaskStatus {
    PENDING = 'Pending',
    COMPLETED = 'Completed',
    OVERDUE = 'Overdue'
}

export enum TaskPriority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High'
}

export interface ITask extends Document {
    title: string;
    description: string;
    deadline: Date;
    priority: TaskPriority;
    status: TaskStatus;
}

const TaskSchema: Schema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    deadline: { type: Date, required: true },
    priority: { 
        type: String, 
        enum: Object.values(TaskPriority), 
        default: TaskPriority.MEDIUM 
    },
    status: { 
        type: String, 
        enum: Object.values(TaskStatus), 
        default: TaskStatus.PENDING 
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (_, ret: any) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

export const TaskModel = mongoose.model<ITask>('Task', TaskSchema);