/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoryServices } from './category.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { User } from '../user/user.model';

// Catrgory controller to create a new category
const createCategory = catchAsync(async (req, res) => {
  const category = req.body;
  const { username } = req.user;
  const getUserData = await User.findOne({ username });
  const categoryData = {
    ...category,
    createdBy: getUserData?._id,
  };

  const result = await CategoryServices.createCategoryIntoDB(categoryData);
  const responseData = {
    // Modify the result to return desired response
    _id: result.id,
    name: result.name,
    createdBy: result.createdBy,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Category created successfully',
    data: responseData,
  });
});

// Controller to get all categories
const getAllCategories = catchAsync(async (req, res) => {
  const results = await CategoryServices.getAllCategoriesFromDB();
  const responseData = results.map((category) => ({
    _id: category.id,
    name: category.name,
    createdBy: {
      _id: (category.createdBy as any)._id,
      username: (category.createdBy as any).username,
      email: (category.createdBy as any).email,
      role: (category.createdBy as any).role,
    },
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  }));

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Categories retrieved successfully',
    data: {
      categories: responseData,
    },
  });
});

export const CategoryControllers = {
  createCategory,
  getAllCategories,
};
