import mongoose, { Schema, Document } from 'mongoose';

export interface IPomodoroSession extends Document {
    taskId: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId; // Optional for now
    startTime: Date;
    endTime?: Date;
    durationMinutes: number;
    status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
    notes?: string;
}

const PomodoroSessionSchema: Schema = new Schema({
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    durationMinutes: { type: Number, default: 25 },
    status: { type: String, enum: ['ACTIVE', 'COMPLETED', 'ABANDONED'], default: 'ACTIVE' },
    notes: { type: String }
}, { timestamps: true });

export const PomodoroSessionModel = mongoose.model<IPomodoroSession>('PomodoroSession', PomodoroSessionSchema);
