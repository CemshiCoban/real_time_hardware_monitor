import mongoose, { Schema } from 'mongoose';
import { IBaseStatus, BaseStatusSchema } from './baseModel';

interface ICpuStatus extends IBaseStatus {
  cores: number[];
  load: number;
  anomalyCpu: number;
}

const CpuStatusSchema: Schema = new Schema({
  cores: { type: [Number], required: true },
  load: { type: Number, required: true },
  anomalyCpu: { type: Number, default: 0 },
}).add(BaseStatusSchema);

export const CpuStatus = mongoose.model<ICpuStatus>(
  'CpuStatus',
  CpuStatusSchema,
);
