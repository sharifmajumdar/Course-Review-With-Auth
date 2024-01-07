import express from 'express';
import { CategoryControllers } from './category.controller';
import validateRequest from '../../middlewares/validateRequest';
import CategoryValidationSchema from './category.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(CategoryValidationSchema), // A middleware to vaidate
  CategoryControllers.createCategory,
);
router.get('/', CategoryControllers.getAllCategories);

export const CategoryRoutes = router;
