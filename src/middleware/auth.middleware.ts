import { Request, Response, NextFunction } from 'express';
import { objectIdSchema, AppError, EErrorCode } from '../types';
import { UsersService } from '../services/users.service';

export function createAuthMiddleware(usersService: UsersService) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const userIdHeader = req.headers['x-user-id'];

      if (typeof userIdHeader !== 'string') {
        throw new AppError(EErrorCode.UNAUTHORIZED, 'Missing x-user-id header');
      }

      const result = objectIdSchema.safeParse(userIdHeader);

      if (!result.success) {
        throw new AppError(EErrorCode.UNAUTHORIZED, 'Invalid x-user-id header');
      }

      try {
        await usersService.isUserExists(result.data);
      } catch {
        throw new AppError(EErrorCode.UNAUTHORIZED, 'User not found');
      }

      req.userId = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
}
