/* eslint-disable @typescript-eslint/no-explicit-any */
import { TReview } from './review.interface';
import { ReviewServices } from './review.service';
import { Types } from 'mongoose';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { User } from '../user/user.model';

const createReview = catchAsync(async (req, res) => {
  const review: TReview = req.body;
  const { username } = req.user;
  const getUserData = await User.findOne({ username });

  const convertCourseIdIntoObjectId = new Types.ObjectId(review.courseId);
  const newReviewData = {
    ...review,
    courseId: convertCourseIdIntoObjectId,
    createdBy: getUserData?._id,
  };

  const result = await ReviewServices.createReviewIntoDB(newReviewData);

  const responseData = {
    _id: result.id,
    courseId: result.courseId,
    rating: result.rating,
    review: result.review,
    createdBy: {
      _id: getUserData?._id,
      username: getUserData?.username,
      email: getUserData?.email,
      role: getUserData?.role,
    },
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Review created successfully',
    data: responseData,
  });
});

export const ReviewControllers = {
  createReview,
};
