import { SensorDataRepository } from '../repositories/sensor-data.repository';
import { ISensorDataDTO } from '../types';

export class SensorDataService {
  constructor(private readonly sensorDataRepository: SensorDataRepository) {}

  async getLatestDataByType(deviceId: string): Promise<ISensorDataDTO[]> {
    return this.sensorDataRepository.findLatestByType(deviceId);
  }
}
