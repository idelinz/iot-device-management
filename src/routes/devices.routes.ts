import { Router } from 'express';
import { DevicesController } from '../controllers/devices.controller';

export const createDevicesRouter = (controller: DevicesController): Router => {
  const router = Router();

  router.get('/', controller.getAllDevices.bind(controller));
  router.get('/:id', controller.getDeviceFullData.bind(controller));
  router.post('/', controller.createDevice.bind(controller));
  router.delete('/:id', controller.deleteDevice.bind(controller));

  return router;
};
