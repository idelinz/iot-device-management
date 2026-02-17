import mongoose, { HydratedDocument, Schema } from 'mongoose';
import { ESensorType, TSensorType } from '../types';

export interface ISensorData {
  deviceId: mongoose.Types.ObjectId;
  sensorType: TSensorType;
  value: number;
  unit: string;
  createdAt: Date;
}

type TSensorDataDocument = HydratedDocument<ISensorData>;

const SensorDataSchema = new Schema<TSensorDataDocument>(
  {
    deviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Device',
      required: [true, 'Device ID is required'],
    },
    sensorType: {
      type: String,
      required: [true, 'Sensor type is required'],
      enum: Object.values(ESensorType),
    },
    value: {
      type: Number,
      required: [true, 'Sensor value is required'],
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true,
    },
  },
  {
    id: false,
    timestamps: { createdAt: true, updatedAt: false },
    toObject: {
      transform: (_doc, { _id, id: _virtualId, __v, deviceId, ...rest }) => {
        return {
          id: _id.toString(),
          deviceId: deviceId.toString(),
          ...rest,
        };
      },
    },
  }
);

SensorDataSchema.index({ deviceId: 1, createdAt: -1 });

export default mongoose.model<TSensorDataDocument>('sensor-data', SensorDataSchema);
