import { ZodError, ZodIssue } from 'zod';
import { TGenericErrorResponse } from '../interface/error';

// Zod error handler
const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorsources = err.issues.map((issue: ZodIssue) => {
    return {
      message: issue.message,
    };
  });

  const errorMessage = errorsources.map((error) => error.message).join('. ');
  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorMessage,
  };
};

export default handleZodError;
