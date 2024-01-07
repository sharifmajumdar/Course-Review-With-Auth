import mongoose from 'mongoose';
import { TGenericErrorResponse } from '../interface/error';

// Validation error handler
const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      const fieldName = val?.path || '';
      const message = `${fieldName} is ${
        val?.kind === 'required' ? 'required' : 'invalid'
      }`;
      return {
        message,
      };
    },
  );

  const errorMessage = errorSources.map((error) => error.message).join('. ');
  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorMessage,
  };
};

export default handleValidationError;
