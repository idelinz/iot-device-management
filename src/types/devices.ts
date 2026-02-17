import { z } from 'zod';
import { objectIdSchema } from './common';

export const EDeviceType = {
  thermostat: 'thermostat',
  smoke_alarm: 'smoke_alarm',
} as const;
export type TDeviceType = (typeof EDeviceType)[keyof typeof EDeviceType];

export interface DeviceModelInfo {
  type: TDeviceType;
  model: string;
}
export const SERIAL_PREFIX_MAP: Record<string, DeviceModelInfo> = {
  'THR-100': { type: EDeviceType.thermostat, model: 'SmartTemp Pro 100' },
  'THR-200': { type: EDeviceType.thermostat, model: 'SmartTemp Elite 200' },
  'SA-100': { type: EDeviceType.smoke_alarm, model: 'SafeGuard Smoke 100' },
  'SA-300': { type: EDeviceType.smoke_alarm, model: 'SafeGuard Pro 300' },
};

export interface TDeviceDTO {
  id: string;
  userId: string;
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

export type TDeviceCreateData = Omit<TDeviceDTO, 'id' | 'createdAt' | 'updatedAt'>;

const createDeviceData = z.object({
  name: z
    .string()
    .min(1, 'Device name is required')
    .max(20, 'Device name cannot exceed 20 characters'),
  serialNumber: z.string().min(1, 'Serial number is required'),
  tags: z.array(z.string()).default([]),
  summary: z.object({
    firmwareVersion: z.string(),
    batteryLevel: z.number().min(0).max(100).optional(),
  }),
});
export const createDeviceSchema = {
  body: createDeviceData,
};
export type TCreateDeviceSchemaParams = z.infer<typeof createDeviceData>;

export const deleteDeviceSchema = {
  params: z.object({
    id: objectIdSchema,
  }),
};
