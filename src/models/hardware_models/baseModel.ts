import { Schema, Document } from 'mongoose';

interface IBaseStatus extends Document {
  createdAt: Date;
}

const BaseStatusSchema: Schema = new Schema({
  createdAt: { type: Date, default: Date.now }
});

export { IBaseStatus, BaseStatusSchema };
