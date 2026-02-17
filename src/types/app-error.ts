export const EErrorCode = {
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const;
export type TErrorCode = (typeof EErrorCode)[keyof typeof EErrorCode];

export class AppError extends Error {
  constructor(
    public readonly code: TErrorCode,
    message: string
  ) {
    super(message);
  }
}
