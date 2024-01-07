/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from '../interface/error';

// Duplicate error handler
const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];
  const errorMessage = `${extractedMessage} is already exists`;
  const statusCode = 400;

  return {
    statusCode,
    message: 'Duplicate Error',
    errorMessage,
  };
};

export default handleDuplicateError;
