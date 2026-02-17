import { UserActionsRepository } from '../repositories/user-actions.repository';
import { DevicesService } from './devices.service';
import { IUserActionDTO } from '../types';
import { TCreateDeviceActionParams } from '../types';

export class UserActionsService {
  devicesService: DevicesService;

  constructor(
    private readonly userActionsRepository: UserActionsRepository,
    { devicesService }: { devicesService: DevicesService }
  ) {
    this.devicesService = devicesService;
  }

  async createAction(
    userId: string,
    { deviceId, ...data }: TCreateDeviceActionParams
  ): Promise<IUserActionDTO> {
    await this.devicesService.getDevice(deviceId, userId);

    return this.userActionsRepository.create({ deviceId, userId, ...data });
  }
}
