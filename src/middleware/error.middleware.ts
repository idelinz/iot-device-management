import { Request, Response, NextFunction } from 'express';
import { AppError, TErrorCode } from '../types';

const ERROR_STATUS_MAP: Record<TErrorCode, number> = {
  RESOURCE_NOT_FOUND: 404,
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
};

export function errorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    const status = ERROR_STATUS_MAP[err.code];
    res.status(status).json({ error: { code: err.code, message: err.message } });
    return;
  }

  console.error(err);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
}
