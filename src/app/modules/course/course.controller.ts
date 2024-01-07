/* eslint-disable @typescript-eslint/no-explicit-any */
import { TCourse, TTags } from './course.interface';
import { CourseServices } from './course.service';
import { Types } from 'mongoose';
import { TReview } from '../review/review.interface';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { User } from '../user/user.model';

// A function to calculate the number of weeks based on startDate and endDate
export function calculationDurationInWeeks(
  startDate: string,
  endDate: string,
): number {
  const startDateInDate = new Date(startDate);
  const endDateInDate = new Date(endDate);
  const startMilliseconds = startDateInDate.getTime();
  const endMilliseconds = endDateInDate.getTime();
  const differenceMilliseconds = Math.abs(endMilliseconds - startMilliseconds);
  const millisecondsInWeek = 1000 * 60 * 60 * 24 * 7;
  const weeks = Math.floor(differenceMilliseconds / millisecondsInWeek);
  return weeks;
}

// Controller to create a new data
const createCourse = catchAsync(async (req, res) => {
  const course: TCourse = req.body;
  const convertCategoryIdIntoObjectId = new Types.ObjectId(course.categoryId); // Convert string into mongoose object Id
  const { username } = req.user;
  const getUserData = await User.findOne({ username });
  //const convertUserIdIntoObjectId = new Types.ObjectId(course.createdBy); // Convert string into mongoose object Id
  /*   const durationInWeeks = calculationDurationInWeeks(
    course.startDate,
    course.endDate,
  ); */
  const newCourseData = {
    ...course,
    categoryId: convertCategoryIdIntoObjectId, // Category ID injected
    createdBy: getUserData?._id,
    //durationInWeeks: durationInWeeks,
  };

  const result = await CourseServices.createCourseIntoDB(newCourseData);

  const responseData = {
    // Modify the result according to the desired response
    _id: result.id,
    title: result.title,
    instructor: result.instructor,
    categoryId: result.categoryId,
    price: result.price,
    tags: result.tags?.map((tag) => ({
      name: tag?.name,
      isDeleted: tag?.isDeleted,
    })),
    startDate: result.startDate,
    endDate: result.endDate,
    language: result.language,
    provider: result.provider,
    durationInWeeks: result.durationInWeeks,
    details: {
      level: result.details?.level,
      description: result.details?.description,
    },
    createdBy: result.createdBy,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Course created successfully',
    data: responseData,
  });
});

// Controller to retrieve data based on the user's query
const getAllCourses = catchAsync(async (req, res) => {
  const { results, totalItem, parsedPage, parsedLimit } =
    await CourseServices.getAllCoursesFromDB(req);
  //console.log(results);
  /*   type TCreatedBy = {
    _id: Types.ObjectId;
    username: string;
    email: string;
    role: string;
  };

 */

  /*   const responseData = results.map((course) => ({
    _id: course._id ? String(course._id) : '',
    title: course.title || '',
    instructor: course.instructor || '',
    categoryId: course.categoryId ? String(course.categoryId) : '',
    price: course.price || 0,
    tags: (course.tags || []).map((tag) => ({
      name: tag?.name || '',
      isDeleted: tag?.isDeleted || false,
    })),
    startDate: course.startDate || '',
    endDate: course.endDate || '',
    language: course.language || '',
    provider: course.provider || '',
    durationInWeeks: course.durationInWeeks || '',
    details: {
      level: course.details?.level || '',
      description: course.details?.description || '',
    },
    createdBy: {
      username: course?.createdBy?.username || '',
    },
    createdAt: course.createdAt || '',
    updatedAt: course.updatedAt || '',
  })); */

  /* const responseData = results.map(
    (
      course: Partial<
        TCourse & { _id?: Types.ObjectId } & { createdBy?: TCreatedBy }
      >,
    ) => ({
      _id: course._id ? String(course._id) : '',
      title: course.title || '',
      instructor: course.instructor || '',
      categoryId: course.categoryId ? String(course.categoryId) : '',
      price: course.price || 0,
      tags: (course.tags || []).map((tag) => ({
        name: tag?.name || '',
        isDeleted: tag?.isDeleted || false,
      })),
      startDate: course.startDate || '',
      endDate: course.endDate || '',
      language: course.language || '',
      provider: course.provider || '',
      durationInWeeks: course.durationInWeeks || '',
      details: {
        level: course.details?.level || '',
        description: course.details?.description || '',
      },
      createdBy: {
        _id: course.createdBy?._id,
        username: course.createdBy?.username || '',
        email: course.createdBy?.email || '',
        role: course.createdBy?.role || '',
      },
      createdAt: course.createdAt || '',
      updatedAt: course.updatedAt || '',
    }),
  ); */

  /*  const responseData = await Promise.all(results.map(async (course) => {
    const createdBy = {
      _id: course.createdBy?._id || '',
      username: course.createdBy?.username || '',
      email: course.createdBy?.email || '',
      role: course.createdBy?.role || '',
    };

    // Add the following lines to fetch user details if 'createdBy' is populated
    if (course.createdBy && typeof course.createdBy === 'object' && !course.createdBy.username) {
      await course.createdBy.populate('createdBy').execPopulate();
      createdBy.username = course.createdBy.username || '';
      createdBy.email = course.createdBy.email || '';
      createdBy.role = course.createdBy.role || '';
    }

    return {
      _id: String(course._id || ''),
      title: course.title || '',
      instructor: course.instructor || '',
      // Rest of your course properties
      createdBy,
      createdAt: course.createdAt || '',
      updatedAt: course.updatedAt || '',
    };
  })); */

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Courses retrieved successfully',
    meta: {
      page: parsedPage,
      limit: parsedLimit,
      total: totalItem,
    },
    data: {
      courses: results,
    },
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  const course: TCourse = req.body;
  let newCourseData = {};

  if (course.categoryId) {
    const convertCategoryIdIntoObjectId = new Types.ObjectId(course.categoryId); // Convert string into mongoose object Id

    newCourseData = {
      ...course,
      categoryId: convertCategoryIdIntoObjectId,
    };
  } else {
    newCourseData = {
      ...course,
    };
  }

  const result = await CourseServices.updateCourseIntoDB(
    courseId,
    newCourseData,
  );

  if (!result) {
    res.status(404).json({
      success: false,
      message: 'Course not found',
    });
    return;
  }

  const responseData: Partial<
    TCourse & { _id: Types.ObjectId } & { durationInWeeks: number }
  > = {};
  if (result._id) {
    responseData._id = result._id;
  }

  if (result.title) {
    responseData.title = result.title;
  }

  if (result.instructor) {
    responseData.instructor = result.instructor;
  }

  if (result.categoryId) {
    responseData.categoryId = result.categoryId;
  }

  if (result.price) {
    responseData.price = result.price;
  }

  if (result.tags && Array.isArray(result.tags)) {
    responseData.tags = result.tags.map((tag) => ({
      name: tag?.name || '',
      isDeleted: tag?.isDeleted || false,
    })) as TTags[];
  }

  if (result.startDate) {
    responseData.startDate = result.startDate;
  }

  if (result.endDate) {
    responseData.endDate = result.endDate;
  }

  if (result.language) {
    responseData.language = result.language;
  }

  if (result.provider) {
    responseData.provider = result.provider;
  }

  if (result.startDate && result.endDate) {
    responseData.durationInWeeks = calculationDurationInWeeks(
      result.startDate,
      result.endDate,
    );
  }

  if (result.details) {
    responseData.details = {
      level: result.details?.level,
      description: result.details?.description,
    };
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Course updated successfully',
    data: responseData,
  });
});

// Controller to get a specific course with review
const getSingleCourseWithReviews = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result =
    await CourseServices.getSingleCourseWithReviewsFromDB(courseId);

  let course = {};
  let reviews: TReview[] = [];

  if (result && result.length > 0) {
    course = {
      _id: result[0]._id,
      title: result[0].title,
      instructor: result[0].instructor,
      categoryId: result[0].categoryId,
      price: result[0].price,
      tags: result[0].tags.map((tag: TTags) => ({
        name: tag.name,
        isDeleted: tag.isDeleted,
      })),
      startDate: result[0].startDate,
      endDate: result[0].endDate,
      language: result[0].language,
      provider: result[0].provider,
      durationInWeeks: calculationDurationInWeeks(
        result[0].startDate,
        result[0].endDate,
      ),
      details: {
        level: result[0].details.level,
        description: result[0].details.description,
      },
    };

    reviews = result[0].reviews.map((review: TReview) => ({
      courseId: review.courseId,
      rating: review.rating,
      review: review.review,
    }));
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Course and Reviews retrieved successfully',
    data: {
      course,
      reviews,
    },
  });
});

// Controller to get the best course by rating
const getBestCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.getBestCourseFromDB();
  let course = {};
  let averageRating = 0;
  let reviewCount = 0;

  if (result) {
    course = {
      _id: result._id,
      title: result.title,
      instructor: result.instructor,
      categoryId: result.categoryId,
      price: result.price,
      tags: result.tags.map((tag: TTags) => ({
        name: tag.name,
        isDeleted: tag.isDeleted,
      })),
      startDate: result.startDate,
      endDate: result.endDate,
      language: result.language,
      provider: result.provider,
      durationInWeeks: calculationDurationInWeeks(
        result.startDate,
        result.endDate,
      ),
      details: {
        level: result.details.level,
        description: result.details.description,
      },
    };

    averageRating = result.averageRating || 0;
    reviewCount = result.reviewCount || 0;
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Best course retrieved successfully',
    data: {
      course,
      averageRating,
      reviewCount,
    },
  });
});

export const CourseControllers = {
  createCourse,
  getAllCourses,
  updateCourse,
  getSingleCourseWithReviews,
  getBestCourse,
};
