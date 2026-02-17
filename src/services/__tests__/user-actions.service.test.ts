import { UserActionsService } from '../user-actions.service';
import { UserActionsRepository } from '../../repositories/user-actions.repository';
import { DevicesService } from '../devices.service';
import { AppError, EErrorCode } from '../../types';

const mockRepo = {
  create: jest.fn(),
} as unknown as jest.Mocked<UserActionsRepository>;

const mockDevicesService = {
  getDevice: jest.fn(),
} as unknown as jest.Mocked<DevicesService>;

const service = new UserActionsService(mockRepo, { devicesService: mockDevicesService });

afterEach(() => jest.clearAllMocks());

describe('UserActionsService', () => {
  const userId = '507f1f77bcf86cd799439011';
  const deviceId = '507f1f77bcf86cd799439022';

  describe('createAction', () => {
    it('verifies device ownership then creates action', async () => {
      mockDevicesService.getDevice.mockResolvedValue({ id: deviceId } as any);
      const action = { id: '1', actionType: 'on', deviceId, userId };
      mockRepo.create.mockResolvedValue(action as any);

      const result = await service.createAction(userId, {
        deviceId,
        actionType: 'on' as const,
        source: 'web_app' as const,
      });

      expect(mockDevicesService.getDevice).toHaveBeenCalledWith(deviceId, userId);
      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ deviceId, userId, actionType: 'on' })
      );
      expect(result).toEqual(action);
    });

    it('throws when device not found', async () => {
      mockDevicesService.getDevice.mockRejectedValue(
        new AppError(EErrorCode.RESOURCE_NOT_FOUND, 'Device not found')
      );

      await expect(
        service.createAction(userId, {
          deviceId,
          actionType: 'on' as const,
          source: 'web_app' as const,
        })
      ).rejects.toMatchObject({ code: EErrorCode.RESOURCE_NOT_FOUND });

      expect(mockRepo.create).not.toHaveBeenCalled();
    });
  });
});
