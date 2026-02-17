import mongoose, { HydratedDocument, Schema } from 'mongoose';
import { EActionType, EActionSource, EActionStatus, TActionType, TActionSource, TActionStatus } from '../types/index';

export interface IUserAction {
  deviceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  actionType: TActionType;
  source: TActionSource;
  status: TActionStatus;
  metadata?: {
    previousValue?: number;
    newValue: number;
    property: string;
    unit: string;
  };
  errorMessage?: string;
  createdAt: Date;
}

type TUserActionDocument = HydratedDocument<IUserAction>;

const UserActionSchema = new Schema<TUserActionDocument>(
  {
    deviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Device',
      required: [true, 'Device ID is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    actionType: {
      type: String,
      required: [true, 'Action type is required'],
      enum: Object.values(EActionType),
    },
    source: {
      type: String,
      required: true,
      enum: Object.values(EActionSource),
      default: EActionSource.web_app,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(EActionStatus),
      default: EActionStatus.pending,
    },
    metadata: {
      type: {
        previousValue: { type: Number },
        newValue: { type: Number, required: true },
        property: { type: String, required: true },
        unit: { type: String, required: true },
      },
      required: function (this: TUserActionDocument) {
        return this.actionType === EActionType.adjust;
      },
    },
    errorMessage: {
      type: String,
      required: function (this: TUserActionDocument) {
        return this.status === EActionStatus.failed;
      },
    },
  },
  {
    id: false,
    timestamps: true,
    toObject: {
      transform: (_doc, { _id, id: _virtualId, __v, deviceId, userId, ...rest }) => {
        return {
          id: _id.toString(),
          deviceId: deviceId.toString(),
          userId: userId.toString(),
          ...rest,
        };
      },
    },
  }
);

UserActionSchema.index({ deviceId: 1, createdAt: -1 });
UserActionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<TUserActionDocument>('user-action', UserActionSchema);
