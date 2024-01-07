import { TUser } from './user.interface';
import { UserServices } from './user.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createUser = catchAsync(async (req, res) => {
  const userData: TUser = req.body;
  console.log(userData);
  const result = await UserServices.createUserIntoDB(userData);

  const responseData = {
    _id: result.id,
    username: result.username,
    email: result.email,
    role: result.role,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User registered successfully',
    data: responseData,
  });
});

const getMe = catchAsync(async (req, res) => {
  // const token = req.headers.authorization;

  // if (!token) {
  //   throw new AppError(httpStatus.NOT_FOUND, 'Token not found !');
  // }

  const { username } = req.user;

  const result = await UserServices.getMe(username);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved succesfully',
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getMe,
};
