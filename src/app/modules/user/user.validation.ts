import { z } from 'zod';

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const UserValidationSchema = z.object({
  body: z.object({
    username: z.string(),
    email: z.string().email({ message: 'Invalid email format!' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(passwordRegex, {
        message:
          'Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character (@$!%*?&)',
      }),
    passwordChangedAt: z.date().optional(),
    role: z.enum(['user', 'admin']).optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export default UserValidationSchema;
