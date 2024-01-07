import express from 'express';
import { CourseControllers } from './course.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidationSchema } from './course.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidationSchema.createCourseValidationSchema), // Middleware to validate(zod, cast and so on)
  CourseControllers.createCourse,
);

router.put(
  '/:courseId',
  validateRequest(CourseValidationSchema.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);

router.get('/', CourseControllers.getAllCourses);

router.get('/:courseId/reviews', CourseControllers.getSingleCourseWithReviews);

router.get('/best', CourseControllers.getBestCourse);

export const CourseRoutes = router;
