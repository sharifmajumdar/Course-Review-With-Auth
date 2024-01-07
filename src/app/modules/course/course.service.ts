/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { calculationDurationInWeeks } from './course.controller';
import { TCourse } from './course.interface';
import { Course } from './course.model';
import { Request } from 'express';
import { Types, startSession } from 'mongoose';

// Course creation
const createCourseIntoDB = async (payload: Partial<TCourse>) => {
  const { title } = payload; // Destructure object

  // Check for data existence
  const isCourseExists = await Course.findOne({ title });

  if (isCourseExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This course alredy exists!'); // Send error into global handler
  }

  const result = await Course.create(payload);
  return result;
};

// Retrieve courses based on user's query
const getAllCoursesFromDB = async (req: Request) => {
  const {
    page = '1',
    limit = '5',
    sortBy = 'startDate',
    sortOrder = 'asc',
    minPrice,
    maxPrice,
    tags,
    startDate,
    endDate,
    language,
    provider,
    durationInWeeks,
    level,
  } = req.query;

  //parsing page and limit data into integer
  const parsedPage = parseInt(page as string);
  const parsedLimit = parseInt(limit as string);

  //filter object for query
  const filterQuery: Record<string, unknown> = {};

  if (minPrice && maxPrice) {
    filterQuery.price = {
      $gte: parseFloat(minPrice as string),
      $lte: parseFloat(maxPrice as string),
    };
  } else if (minPrice) {
    filterQuery.price = { $gte: parseFloat(minPrice as string) };
  } else if (maxPrice) {
    filterQuery.price = { $lte: parseFloat(maxPrice as string) };
  }

  if (tags) {
    filterQuery['tags.name'] = tags as string;
  }

  if (startDate) {
    filterQuery.startDate = startDate as string;
  }

  if (endDate) {
    filterQuery.endDate = endDate as string;
  }

  if (language) {
    filterQuery.language = language as string;
  }

  if (provider) {
    filterQuery.provider = provider as string;
  }

  if (durationInWeeks) {
    const getCourses = await Course.find(filterQuery).lean();

    const filteredCourses = getCourses.filter((result) => {
      const weeks = calculationDurationInWeeks(
        result.startDate,
        result.endDate,
      );
      return weeks === parseInt(durationInWeeks as string, 10);
    });

    const results = filteredCourses.slice(
      (parsedPage - 1) * parsedLimit,
      parsedPage * parsedLimit,
    );

    const totalItem = results.length;

    return {
      results,
      totalItem,
      parsedPage,
      parsedLimit,
    };
  }

  if (level) {
    filterQuery['details.level'] = level as string;
  }

  const totalItem = await Course.countDocuments(filterQuery); // Count number of items
  const result = Course.find();

  const results = await result
    .find(filterQuery)
    .sort({ [sortBy as string]: sortOrder === 'asc' ? 1 : -1 })
    .skip((parsedPage - 1) * parsedLimit)
    .limit(parsedLimit)
    .populate({
      path: 'createdBy',
      select: 'username email role',
    })
    .lean();

  return {
    results,
    totalItem,
    parsedPage,
    parsedLimit,
  };
};

//update course service
const updateCourseIntoDB = async (
  courseId: string,
  payload: Partial<TCourse>,
) => {
  const convertCourseIdIntoObjectId = new Types.ObjectId(courseId);

  const session = await startSession(); // Session start

  try {
    session.startTransaction(); // Transaction start

    const isCourseExists = await Course.findById(convertCourseIdIntoObjectId);

    if (!isCourseExists) {
      throw new AppError(httpStatus.NOT_FOUND, 'This course is not exists!');
    }

    const { tags, details, ...remainingCourseData } = payload;
    const modifiedUpdatedData: Record<string, unknown> = {
      ...remainingCourseData,
    };

    if (tags && tags.length) {
      modifiedUpdatedData.tags = tags.map((tag) => ({
        name: tag?.name || undefined,
        isDeleted: tag?.isDeleted || false,
      }));
    }

    if (details && Object.keys(details).length) {
      for (const [key, value] of Object.entries(details)) {
        modifiedUpdatedData[`details.${key}`] = value;
      }
    }

    const result = await Course.findByIdAndUpdate(
      convertCourseIdIntoObjectId,
      modifiedUpdatedData,
      {
        new: true,
        session,
      },
    );

    await session.commitTransaction(); // Transaction end
    await session.endSession(); // Session end
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

// Get a specific course with reviews
const getSingleCourseWithReviewsFromDB = async (courseId: string) => {
  const convertCourseIdIntoObjectId = new Types.ObjectId(courseId); // Convert string into mongoose object

  const isCourseExists = await Course.findById(convertCourseIdIntoObjectId);

  // Check for data existence
  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This course is not exists!');
  }

  const result = await Course.aggregate([
    {
      $match: { _id: convertCourseIdIntoObjectId },
    },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'courseId',
        as: 'reviews',
      },
    },
  ]);

  return result;
};

// Get the best course with review rating from course and review collections
const getBestCourseFromDB = async () => {
  const result = await Course.aggregate([
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'courseId',
        as: 'reviews',
      },
    },
    {
      $addFields: {
        reviews: {
          $map: {
            input: '$reviews',
            as: 'review',
            in: {
              $mergeObjects: [
                '$$review',
                { rating: { $toDouble: '$$review.rating' } },
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        instructor: 1,
        categoryId: 1,
        price: 1,
        tags: 1,
        startDate: 1,
        endDate: 1,
        language: 1,
        provider: 1,
        details: 1,
        averageRating: { $avg: '$reviews.rating' },
        reviewCount: { $size: '$reviews' },
      },
    },
    {
      $sort: { averageRating: -1 },
    },
    {
      $limit: 1,
    },
  ]);

  return result.length > 0 ? result[0] : null;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  updateCourseIntoDB,
  getSingleCourseWithReviewsFromDB,
  getBestCourseFromDB,
};
