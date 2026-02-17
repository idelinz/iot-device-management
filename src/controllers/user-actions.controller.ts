import { Request, Response, NextFunction } from 'express';
import { UserActionsService } from '../services/user-actions.service';
import { createDeviceActionSchema } from '../types';
import { BaseController } from './base.controller';

export class UserActionsController extends BaseController {
  constructor(private readonly userActionsService: UserActionsService) {
    super();
  }

  async createAction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = this.validate(createDeviceActionSchema.body, req.body);

      const action = await this.userActionsService.createAction(req.userId as string, data);

      res.status(201).json({
        data: action,
      });
    } catch (error) {
      next(error);
    }
  }
}
