import { z } from 'zod';
import { objectIdSchema } from './common';

export const EActionType = {
  on: 'on',
  off: 'off',
  reboot: 'reboot',
  ota_update: 'ota_update',
  adjust: 'adjust',
} as const;
export type TActionType = (typeof EActionType)[keyof typeof EActionType];

export const EActionSource = {
  web_app: 'web_app',
  mobile_app: 'mobile_app',
  physical_switch: 'physical_switch',
} as const;
export type TActionSource = (typeof EActionSource)[keyof typeof EActionSource];

export const EActionStatus = {
  pending: 'pending',
  success: 'success',
  failed: 'failed',
} as const;
export type TActionStatus = (typeof EActionStatus)[keyof typeof EActionStatus];

export interface IUserActionDTO {
  id: string;
  deviceId: string;
  userId: string;
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
export type TUserActionCreateData = Omit<IUserActionDTO, 'id' | 'createdAt' | 'status'>;

const metadataSchema = z.object({
  previousValue: z.number().optional(),
  newValue: z.number(),
  property: z.string(),
  unit: z.string(),
});

const createDeviceActionData = z
  .object({
    deviceId: objectIdSchema,
    actionType: z.enum(EActionType),
    source: z.enum(EActionSource).default(EActionSource.web_app),
    metadata: metadataSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.actionType === EActionType.adjust && !data.metadata) {
      ctx.addIssue({
        code: 'custom',
        message: `Metadata is required for ${EActionType.adjust} actions`,
        path: ['metadata'],
      });
    }
  });
export const createDeviceActionSchema = {
  body: createDeviceActionData,
};
export type TCreateDeviceActionParams = z.infer<typeof createDeviceActionData>;
