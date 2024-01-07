import { z } from 'zod';
import { Types } from 'mongoose';

const isValidObjectId = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return Types.ObjectId.isValid(value);
  }
  return false;
};

const CategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(20), // Category name can be 1 to 20 characters
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

export default CategoryValidationSchema;
