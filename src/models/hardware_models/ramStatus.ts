import mongoose, { Schema } from 'mongoose';
import { IBaseStatus, BaseStatusSchema } from './baseModel';

interface IRamStatus extends IBaseStatus {
  usage: number;
}

const RamStatusSchema: Schema = new Schema({
  usage: { type: Number, required: true },
}).add(BaseStatusSchema);

export const RamStatus = mongoose.model<IRamStatus>(
  'RamStatus',
  RamStatusSchema,
);
