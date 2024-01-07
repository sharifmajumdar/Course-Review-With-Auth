import { z } from 'zod';
import { Types } from 'mongoose';

const TagsValidationSchema = z.object({
  name: z.string(),
  isDeleted: z.boolean(),
});

const DetailsValidationSchema = z.object({
  level: z.string(),
  description: z.string(),
});

const isValidObjectId = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return Types.ObjectId.isValid(value);
  }
  return false;
};

// Schema for course creation
const createCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(30, {
      message: 'Category name can not be more than 30 characters',
    }),
    instructor: z.string(),
    categoryId: z.string().refine(isValidObjectId, {
      message: 'Invalid ObjectId format',
    }),
    price: z.number(),
    tags: z.array(TagsValidationSchema).optional(),
    startDate: z.string(),
    endDate: z.string(),
    language: z.string(),
    provider: z.string(),
    durationInWeeks: z.number().optional(),
    details: DetailsValidationSchema.optional(),
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

// Schema for updating course
const updateCourseValidationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1)
      .max(30, {
        message: 'Category name can not be more than 30 characters',
      })
      .optional(),
    instructor: z.string().optional(),
    categoryId: z
      .string()
      .refine(isValidObjectId, {
        message: 'Invalid ObjectId format',
      })
      .optional(),
    price: z.number().optional(),
    tags: z.array(TagsValidationSchema).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    language: z.string().optional(),
    provider: z.string().optional(),
    details: DetailsValidationSchema.optional(),
  }),
});

export const CourseValidationSchema = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
};
