import mongoose from 'mongoose';
import SensorData from '../models/SensorData';
import { ISensorDataDTO } from '../types';

export class SensorDataRepository {
  async findLatestByType(deviceId: string): Promise<ISensorDataDTO[]> {
    return SensorData.aggregate<ISensorDataDTO>([
      { $match: { deviceId: new mongoose.Types.ObjectId(deviceId) } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$sensorType',
          doc: { $first: '$$ROOT' },
        },
      },
      { $replaceRoot: { newRoot: '$doc' } },
      { $project: { sensorType: 1, value: 1, unit: 1, createdAt: 1, _id: 0 } },
    ]);
  }
}
