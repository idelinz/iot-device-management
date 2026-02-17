import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from './config/database';

import { DevicesRepository } from './repositories/devices.repository';
import { SensorDataRepository } from './repositories/sensor-data.repository';
import { UserActionsRepository } from './repositories/user-actions.repository';
import { UsersRepository } from './repositories/users.repository';
import { DevicesService } from './services/devices.service';
import { SensorDataService } from './services/sensor-data.service';
import { UsersService } from './services/users.service';
import { UserActionsService } from './services/user-actions.service';
import { DevicesController } from './controllers/devices.controller';
import { UserActionsController } from './controllers/user-actions.controller';
import { createDevicesRouter } from './routes/devices.routes';
import { createUserActionsRouter } from './routes/user-actions.routes';
import { createAuthMiddleware } from './middleware/auth.middleware';
import { errorMiddleware } from './middleware/error.middleware';

dotenv.config();

const initServer = async (): Promise<void> => {
  const app = express();
  const PORT = process.env.PORT;

  await connectDatabase();

  app.use(express.json());

  const devicesRepository = new DevicesRepository();
  const sensorDataRepository = new SensorDataRepository();
  const userActionsRepository = new UserActionsRepository();
  const usersRepository = new UsersRepository();

  const usersService = new UsersService(usersRepository);
  const sensorDataService = new SensorDataService(sensorDataRepository);
  const devicesService = new DevicesService(devicesRepository, {
    sensorDataService,
  });
  const devicesController = new DevicesController(devicesService);

  const userActionsService = new UserActionsService(userActionsRepository, { devicesService });
  const userActionsController = new UserActionsController(userActionsService);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
  });

  app.use('/api', createAuthMiddleware(usersService));
  app.use('/api/devices', createDevicesRouter(devicesController));
  app.use('/api/actions', createUserActionsRouter(userActionsController));

  app.use(errorMiddleware);

  const server = app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });

  const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
    console.log(`Received ${signal}. Server is shutting down now...`);

    try {
      server.close();
    } catch (error) {
      console.error({
        message: 'Failed to stop server',
        error,
      });
    }

    try {
      await disconnectDatabase();
      console.info('DB connection closed');
    } catch (error) {
      console.error({
        message: 'Failed to close connection to DB',
        error,
      });
    }

    process.exit(0);
  };

  process.on('SIGINT', shutdown);

  process.on('unhandledRejection', (error: Error) => {
    console.error('unhandledRejection:', error);
    process.exit(1);
  });

  process.on('uncaughtException', error => {
    console.error('uncaughtException', error);

    process.exit(1);
  });
};

initServer();
