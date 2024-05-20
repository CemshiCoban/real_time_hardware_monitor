import mongoose, { Schema, Document } from 'mongoose';

export interface IUserSettings extends Document {
  email: string;
  maxCpu: number;
  maxDisk: number;
  alertCount: number;
  createdAt: Date;
}

const UserSettingsSchema: Schema = new Schema({
  email: { type: String, required: true },
  maxCpu: { type: Number, required: true },
  maxDisk: { type: Number, required: true },
  alertCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const UserSettings = mongoose.model<IUserSettings>('UserSettings', UserSettingsSchema);
