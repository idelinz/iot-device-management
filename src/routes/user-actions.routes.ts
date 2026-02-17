import { Router } from 'express';
import { UserActionsController } from '../controllers/user-actions.controller';

export const createUserActionsRouter = (controller: UserActionsController): Router => {
  const router = Router();

  router.post('/', controller.createAction.bind(controller));

  return router;
};
