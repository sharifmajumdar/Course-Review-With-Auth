import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import UserValidationSchema from './user.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

router.post(
  '/register',
  validateRequest(UserValidationSchema), // Middleware to check errors
  UserControllers.createUser,
);

router.get('/me', auth(USER_ROLE.admin, USER_ROLE.user), UserControllers.getMe);

export const UserRoutes = router;
