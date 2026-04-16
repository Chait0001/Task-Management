import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
    name: string;
    tasks: mongoose.Types.ObjectId[];
}

const ProjectSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
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

export const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);