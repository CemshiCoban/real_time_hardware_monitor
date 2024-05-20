import mongoose, { Schema, Document } from 'mongoose';

interface ICpuStatus extends Document {
  cores: number[];
  load: number;
  createdAt: Date;
}

interface IRamStatus extends Document {
  usage: number;
  createdAt: Date;
}

interface IDiskStatus extends Document {
  usage: number;
  createdAt: Date;
}

interface INetworkStatus extends Document {
  network: {
    [key: string]: {
      inputBytes: number;
      outputBytes: number;
    };
  };
  createdAt: Date;
}

const CpuStatusSchema: Schema = new Schema({
  cores: { type: [Number], required: true },
  load: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const RamStatusSchema: Schema = new Schema({
  usage: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const DiskStatusSchema: Schema = new Schema({
  usage: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const NetworkStatusSchema: Schema = new Schema({
  network: {
    type: Map,
    of: {
      inputBytes: { type: Number, required: true },
      outputBytes: { type: Number, required: true }
    }
  },
  createdAt: { type: Date, default: Date.now }
});

export const CpuStatus = mongoose.model<ICpuStatus>('CpuStatus', CpuStatusSchema);
export const RamStatus = mongoose.model<IRamStatus>('RamStatus', RamStatusSchema);
export const DiskStatus = mongoose.model<IDiskStatus>('DiskStatus', DiskStatusSchema);
export const NetworkStatus = mongoose.model<INetworkStatus>('NetworkStatus', NetworkStatusSchema);
