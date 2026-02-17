export const ESensorType = {
  temperature: 'temperature',
  humidity: 'humidity',
  smoke: 'smoke',
} as const;
export type TSensorType = (typeof ESensorType)[keyof typeof ESensorType];

export interface ISensorDataDTO {
  id: string;
  deviceId: string;
  sensorType: TSensorType;
  value: number;
  unit: string;
  createdAt: Date;
}
