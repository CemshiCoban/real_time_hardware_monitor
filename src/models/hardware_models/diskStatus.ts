import mongoose, { Schema } from 'mongoose';
import { IBaseStatus, BaseStatusSchema } from './baseModel';

interface IDiskStatus extends IBaseStatus {
  usage: number;
  anomalyDisk: number;
}

const DiskStatusSchema: Schema = new Schema({
  usage: { type: Number, required: true },
  anomalyDisk: { type: Number, default: 0 },
}).add(BaseStatusSchema);

export const DiskStatus = mongoose.model<IDiskStatus>(
  'DiskStatus',
  DiskStatusSchema,
);
