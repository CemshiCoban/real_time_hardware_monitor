import mongoose, { Schema } from 'mongoose';
import { IBaseStatus, BaseStatusSchema } from './baseModel';

interface INetworkStatus extends IBaseStatus {
  network: {
    [key: string]: {
      inputBytes: number;
      outputBytes: number;
    };
  };
}

const NetworkStatusSchema: Schema = new Schema({
  network: {
    type: Map,
    of: new Schema({
      inputBytes: { type: Number, required: true },
      outputBytes: { type: Number, required: true }
    })
  }
}).add(BaseStatusSchema);

export const NetworkStatus = mongoose.model<INetworkStatus>('NetworkStatus', NetworkStatusSchema);
