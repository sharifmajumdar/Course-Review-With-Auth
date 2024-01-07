import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TReview } from './review.interface';
import { Review } from './review.model';
import { Course } from '../course/course.model';

const createReviewIntoDB = async (payload: TReview) => {
  const _id = payload.courseId;

  const isCourseExists = await Course.findById(_id);

  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This course is not exists!');
  }

  const result = await Review.create(payload);
  return result;
};

export const ReviewServices = {
  createReviewIntoDB,
};
