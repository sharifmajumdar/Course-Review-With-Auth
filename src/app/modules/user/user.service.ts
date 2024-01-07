import { User } from './user.model';
import { TUser } from './user.interface';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

const createUserIntoDB = async (payload: TUser) => {
  const { username } = payload;

  const isUserExists = await User.findOne({ username });

  if (isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists!');
  }

  const userDataWithTimestamp = {
    ...payload,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await User.create(userDataWithTimestamp);
  return result;
};

const getMe = async (username: string) => {
  // const decoded = verifyToken(token, config.jwt_access_secret as string);
  // const { userId, role } = decoded;

  /*   let result = null;
  if (role === 'user') {
    result = await User.findOne({ username: username });
  }
  if (role === 'admin') {
    result = await User.findOne({ username: username });
  } */

  const result = await User.findOne({ username });

  return result;
};

export const UserServices = {
  createUserIntoDB,
  getMe,
};
