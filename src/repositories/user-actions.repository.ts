import UserAction from '../models/UserAction';
import { IUserActionDTO, TUserActionCreateData } from '../types';

export class UserActionsRepository {
  async create(data: TUserActionCreateData): Promise<IUserActionDTO> {
    const action = await UserAction.create(data);
    return action.toObject<IUserActionDTO>();
  }

  async findLatestByDeviceId(deviceId: string): Promise<IUserActionDTO | null> {
    const action = await UserAction.findOne({ deviceId }).sort({ createdAt: -1 });
    return action?.toObject<IUserActionDTO>() ?? null;
  }
}