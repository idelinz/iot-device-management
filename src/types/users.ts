export const ERoles = {
  admin: 'admin',
  user: 'user',
} as const;
export type TRole = (typeof ERoles)[keyof typeof ERoles];

export const EPreferredUnits = {
  metric: 'metric',
  imperial: 'imperial',
} as const;
export type TPreferredUnits = (typeof EPreferredUnits)[keyof typeof EPreferredUnits];

export interface IUserDTO {
  id: string;
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
