import mongoose, { Schema } from 'mongoose';
import { IBaseStatus, BaseStatusSchema } from './baseModel';

export interface NetworkData {
  inputBytes: number;
  outputBytes: number;
}

export interface INetworkStatus extends IBaseStatus {
  network: {
    [key: string]: NetworkData;
  };
}

const NetworkStatusSchema: Schema = new Schema({
  network: {
    type: Map,
    of: new Schema({
      inputBytes: { type: Number, required: true },
      outputBytes: { type: Number, required: true },
    }),
  },
}).add(BaseStatusSchema);

export const NetworkStatus = mongoose.model<INetworkStatus>(
  'NetworkStatus',
  NetworkStatusSchema,
);
