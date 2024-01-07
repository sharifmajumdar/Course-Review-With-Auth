import { z } from 'zod';
import { Types } from 'mongoose';

const isValidObjectId = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return Types.ObjectId.isValid(value);
  }
  return false;
};

const ReviewValidationSchema = z.object({
  body: z.object({
    courseId: z.string().refine(isValidObjectId, {
      message: 'Invalid ObjectId format',
    }),
    rating: z.enum(['1', '2', '3', '4', '5']).refine(
      (value) => {
        if (!value) return false;
        const numericValue = parseInt(value, 10);
        return !isNaN(numericValue) && numericValue >= 1 && numericValue <= 5;
      },
      { message: 'Rating must be a number between 1 and 5.' },
    ),
    review: z.string().min(1, { message: 'Review is required!' }),
    createdBy: z
      .string()
      .refine(isValidObjectId, {
        message: 'Invalid ObjectId format',
      })
      .optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  }),
});

export default ReviewValidationSchema;
