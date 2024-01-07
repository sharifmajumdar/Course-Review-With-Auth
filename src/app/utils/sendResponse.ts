import { Response } from 'express';

type TResponse<T> = {
  success: boolean;
  statusCode: number;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};

// A common response pattern in JSON format
const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    meta: data.meta,
    data: data.data,
  });
};

export default sendResponse;
