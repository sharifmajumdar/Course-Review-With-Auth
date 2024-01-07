import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TCategory } from './category.interface';
import { Category } from './category.model';

// A service to create new data into database
const createCategoryIntoDB = async (payload: TCategory) => {
  const { name } = payload; // Destructure the entity

  const isCategoryExists = await Category.findOne({ name }); //Check whether same data is already exists or not

  if (isCategoryExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This category alredy exists!');
  }

  const result = await Category.create(payload);
  return result;
};

const getAllCategoriesFromDB = async () => {
  const result = await Category.find().populate({
    path: 'createdBy',
    select: 'username email role',
  });
  return result;
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
};
