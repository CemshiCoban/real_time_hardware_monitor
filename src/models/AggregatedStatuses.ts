import mongoose, { Schema, Document } from 'mongoose';
import { BaseStatusSchema } from './hardware_models/baseModel';

interface ISystemInfoAggregate extends Document {
  timestamp: Date;
  avgCpuLoad: number;
  avgRamUsage: number;
  anomalyCountCpu: number;
  anomalyCountDisk: number;
}

const SystemInfoAggregateSchema: Schema = new Schema({
  timestamp: { type: Date, required: true },
  avgCpuLoad: { type: Number, required: true },
  avgDiskUsage: { type: Number, required: true },
  anomalyCountCpu: { type: Number, default: 0 },
  anomalyCountDisk: { type: Number, default: 0 },
}).add(BaseStatusSchema);

export const SystemInfoPerMinute = mongoose.model<ISystemInfoAggregate>(
  'SystemInfoPerMinute',
  SystemInfoAggregateSchema,
);
export const SystemInfoPerHour = mongoose.model<ISystemInfoAggregate>(
  'SystemInfoPerHour',
  SystemInfoAggregateSchema,
);
export const SystemInfoPerDay = mongoose.model<ISystemInfoAggregate>(
  'SystemInfoPerDay',
  SystemInfoAggregateSchema,
);
export const SystemInfoPerMonth = mongoose.model<ISystemInfoAggregate>(
  'SystemInfoPerMonth',
  SystemInfoAggregateSchema,
);
export const SystemInfoPerYear = mongoose.model<ISystemInfoAggregate>(
  'SystemInfoPerYear',
  SystemInfoAggregateSchema,
);
