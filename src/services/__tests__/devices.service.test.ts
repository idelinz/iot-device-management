import { DevicesService, DEVICE_SUMMARY_FIELDS } from '../devices.service';
import { DevicesRepository } from '../../repositories/devices.repository';
import { SensorDataService } from '../sensor-data.service';
import { AppError, EErrorCode } from '../../types';

const mockRepo = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  deleteById: jest.fn(),
} as unknown as jest.Mocked<DevicesRepository>;

const mockSensorDataService = {
  getLatestDataByType: jest.fn(),
} as unknown as jest.Mocked<SensorDataService>;

const service = new DevicesService(mockRepo, { sensorDataService: mockSensorDataService });

afterEach(() => jest.clearAllMocks());

describe('DevicesService', () => {
  const userId = '507f1f77bcf86cd799439011';

  describe('getAllDevices', () => {
    it('calls repository with summary projection', async () => {
      mockRepo.findAll.mockResolvedValue([]);

      const result = await service.getAllDevices(userId);

      expect(mockRepo.findAll).toHaveBeenCalledWith(userId, DEVICE_SUMMARY_FIELDS);
      expect(result).toEqual([]);
    });
  });

  describe('getDevice', () => {
    it('returns device when found', async () => {
      const device = { id: '123', name: 'Thermostat' };
      mockRepo.findOne.mockResolvedValue(device as any);

      const result = await service.getDevice('123', userId);

      expect(result).toEqual(device);
    });

    it('throws RESOURCE_NOT_FOUND when device is missing', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.getDevice('123', userId)).rejects.toThrow(AppError);
      await expect(service.getDevice('123', userId)).rejects.toMatchObject({
        code: EErrorCode.RESOURCE_NOT_FOUND,
      });
    });
  });

  describe('createDevice', () => {
    it('resolves device type and model from serial prefix', async () => {
      mockRepo.create.mockImplementation(async data => ({ id: '1', ...data }) as any);

      await service.createDevice(userId, {
        serialNumber: 'THR-100-abc',
        name: 'My Thermostat',
        tags: [],
        summary: { firmwareVersion: '1.0.0' },
      });

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'thermostat',
          deviceModel: 'SmartTemp Pro 100',
          serialNumber: 'THR-100-abc',
        })
      );
    });

    it('throws VALIDATION_ERROR for unknown serial prefix', async () => {
      await expect(
        service.createDevice(userId, {
          serialNumber: 'UNKNOWN-123',
          name: 'Bad Device',
          tags: [],
          summary: { firmwareVersion: '1.0.0' },
        })
      ).rejects.toMatchObject({ code: EErrorCode.VALIDATION_ERROR });
    });
  });

  describe('deleteDevice', () => {
    it('deletes when device exists', async () => {
      mockRepo.findOne.mockResolvedValue({ id: '123' } as any);
      mockRepo.deleteById.mockResolvedValue(null);

      await service.deleteDevice('123', userId);

      expect(mockRepo.deleteById).toHaveBeenCalledWith('123');
    });

    it('throws when device does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.deleteDevice('123', userId)).rejects.toThrow(AppError);
    });
  });
});
