import mongoose, { Schema } from 'mongoose';
import { IBaseStatus, BaseStatusSchema } from './baseModel';

interface IDiskStatus extends IBaseStatus {
  usage: number;
}

const DiskStatusSchema: Schema = new Schema({
  usage: { type: Number, required: true }
}).add(BaseStatusSchema);

export const DiskStatus = mongoose.model<IDiskStatus>('DiskStatus', DiskStatusSchema);
