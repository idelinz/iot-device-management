import mongoose, { HydratedDocument, Schema } from 'mongoose';
import { ERoles, EPreferredUnits, TRole, TPreferredUnits } from '../types';

export interface IUser {
  email: string;
  name: string;
  role: TRole;
  settings: {
    notificationsEnabled: boolean;
    preferredUnits: TPreferredUnits;
  };
  createdAt: Date;
  updatedAt: Date;
}

type TUserDocument = HydratedDocument<IUser>;

const UserSchema = new Schema<TUserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    role: {
      type: String,
      enum: Object.values(ERoles),
      default: ERoles.user,
    },
    settings: {
      notificationsEnabled: {
        type: Boolean,
        default: true,
      },
      preferredUnits: {
        type: String,
        enum: Object.values(EPreferredUnits),
        default: EPreferredUnits.metric,
      },
    },
  },
  {
    id: false,
    timestamps: true,
    toObject: {
      transform: (_doc, { _id, id: _virtualId, __v, ...rest }) => {
        return {
          id: _id.toString(),
          ...rest,
        };
      },
    },
  }
);

export default mongoose.model<TUserDocument>('user', UserSchema);
