import mongoose from 'mongoose';
import { TGenericErrorResponse } from '../interface/error';

// ID existence error handler
const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errorMessage = `${err.value} is not a valid ID!`;

  const statusCode = 400;

  return {
    statusCode,
    message: 'Invalid ID',
    errorMessage,
  };
};

export default handleCastError;
