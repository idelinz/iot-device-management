import mongoose, { Schema, HydratedDocument } from 'mongoose';
import { EDeviceType, TDeviceType } from '../types';

export interface IDevice {
  userId: mongoose.Types.ObjectId;
  deviceModel: string;
  serialNumber: string;
  name: string;
  type: TDeviceType;
  tags: string[];
  summary: {
    firmwareVersion: string;
    batteryLevel?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

type TDeviceDocument = HydratedDocument<IDevice>;

const DeviceSchema = new Schema<TDeviceDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Device name is required'],
      trim: true,
      maxlength: [100, 'Device name cannot exceed 100 characters'],
    },
    type: {
      type: String,
      required: [true, 'Device type is required'],
      enum: {
        values: Object.values(EDeviceType),
        message: '{VALUE} is not a valid device type',
      },
    },
    deviceModel: {
      type: String,
      required: [true, 'Device model is required'],
      trim: true,
    },
    serialNumber: {
      type: String,
      required: [true, 'Serial number is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    summary: {
      firmwareVersion: {
        type: String,
      },
      batteryLevel: {
        type: Number,
        min: 0,
        max: 100,
      },
    },
  },
  {
    id: false,
    timestamps: true,
    toObject: {
      transform: (_doc, { _id, id: _virtualId, __v, userId, ...rest }) => {
        return {
          id: _id.toString(),
          userId: userId.toString(),
          ...rest,
        };
      },
    },
  }
);

DeviceSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<TDeviceDocument>('device', DeviceSchema);
