import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true }
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

export const UserModel = mongoose.model<IUser>('User', UserSchema);