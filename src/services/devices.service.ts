import { DevicesRepository } from '../repositories/devices.repository';
import { SensorDataService } from './sensor-data.service';
import {
  AppError,
  EErrorCode,
  TDeviceDTO,
  ISensorDataDTO,
  SERIAL_PREFIX_MAP,
  TCreateDeviceSchemaParams,
  TDeviceType,
} from '../types';

export const DEVICE_SUMMARY_FIELDS = [
  'id',
  'userId',
  'deviceModel',
  'name',
  'tags',
  'summary',
] as const;

export type TGetAllDevicesResult = Pick<TDeviceDTO, (typeof DEVICE_SUMMARY_FIELDS)[number]>[];

export type TGetDeviceFullDataResult = {
  device: TDeviceDTO;
  latestSensorData: ISensorDataDTO[];
};

export class DevicesService {
  private readonly sensorDataService: SensorDataService;
  constructor(
    private readonly devicesRepository: DevicesRepository,
    { sensorDataService }: { sensorDataService: SensorDataService }
  ) {
    this.sensorDataService = sensorDataService;
  }

  async getAllDevices(userId: string): Promise<TGetAllDevicesResult> {
    const devices = await this.devicesRepository.findAll(userId, DEVICE_SUMMARY_FIELDS);
    return devices;
  }

  async getDevice(id: string, userId: string): Promise<TDeviceDTO> {
    const device = await this.devicesRepository.findOne(id, userId);

    if (!device) {
      throw new AppError(EErrorCode.RESOURCE_NOT_FOUND, 'Device not found');
    }

    return device;
  }

  async getDeviceFullData(id: string, userId: string): Promise<TGetDeviceFullDataResult> {
    const [device, latestSensorData] = await Promise.all([
      this.getDevice(id, userId),
      this.sensorDataService.getLatestDataByType(id),
    ]);

    return { device, latestSensorData };
  }

  async createDevice(
    userId: string,
    { serialNumber, ...rest }: TCreateDeviceSchemaParams
  ): Promise<TDeviceDTO> {
    const { type, model } = this.resolveDeviceInfo(serialNumber);

    return this.devicesRepository.create({
      serialNumber,
      userId,
      type,
      deviceModel: model,
      ...rest,
    });
  }

  async deleteDevice(id: string, userId: string): Promise<void> {
    await this.getDevice(id, userId);

    await this.devicesRepository.deleteById(id);
  }

  private resolveDeviceInfo(serialNumber: string): { type: TDeviceType; model: string } {
    const prefix = Object.keys(SERIAL_PREFIX_MAP).find(p => serialNumber.startsWith(p));

    if (!prefix) {
      throw new AppError(EErrorCode.VALIDATION_ERROR, `Unknown serial number prefix: '${serialNumber}'`);
    }

    return SERIAL_PREFIX_MAP[prefix];
  }
}
