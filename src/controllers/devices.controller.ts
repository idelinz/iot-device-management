import { Request, Response, NextFunction } from 'express';
import {
  DevicesService,
  TGetAllDevicesResult,
  TGetDeviceFullDataResult,
} from '../services/devices.service';
import { getByIdSchema, createDeviceSchema, deleteDeviceSchema } from '../types';
import { BaseController } from './base.controller';

export class DevicesController extends BaseController {
  constructor(private readonly devicesService: DevicesService) {
    super();
  }

  async getAllDevices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result: TGetAllDevicesResult = await this.devicesService.getAllDevices(
        req.userId as string
      );

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDeviceFullData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = this.validate(getByIdSchema.params, req.params);

      const result: TGetDeviceFullDataResult = await this.devicesService.getDeviceFullData(
        params.id,
        req.userId as string
      );

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async createDevice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = this.validate(createDeviceSchema.body, req.body);

      const device = await this.devicesService.createDevice(req.userId as string, body);

      res.status(201).json({
        data: device,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteDevice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = this.validate(deleteDeviceSchema.params, req.params);

      await this.devicesService.deleteDevice(params.id, req.userId as string);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
