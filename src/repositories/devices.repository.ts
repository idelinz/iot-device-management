import Device from '../models/Device';
import { TDeviceDTO, TDeviceCreateData } from '../types';

export class DevicesRepository {
  async findAll<K extends keyof TDeviceDTO>(
    userId: string,
    projection?: readonly K[]
  ): Promise<Pick<TDeviceDTO, K>[]> {
    const query = Device.find({ userId });

    if (projection?.length) {
      query.select(projection);
    }

    const devices = await query.sort({ updatedAt: -1 });

    return devices.map(device => device.toObject<TDeviceDTO>());
  }

  async findOne(id: string, userId: string): Promise<TDeviceDTO | null> {
    const device = await Device.findOne({ _id: id, userId });
    return device?.toObject<TDeviceDTO>() ?? null;
  }

  async create(data: TDeviceCreateData): Promise<TDeviceDTO> {
    const device = await Device.create(data);
    return device.toObject<TDeviceDTO>();
  }

  async deleteById(id: string): Promise<null> {
    await Device.findByIdAndDelete(id);

    return null;
  }
}
