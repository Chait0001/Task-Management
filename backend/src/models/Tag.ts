import mongoose, { Schema, Document } from 'mongoose';

export interface ITag extends Document {
  name: string;
  color: string;
}

const TagSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  color: { type: String, default: '#8b5cf6' }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret: any) => { ret.id = ret._id; delete ret._id; delete ret.__v; }
  }
});

export const TagModel = mongoose.model<ITag>('Tag', TagSchema);
