import { z } from 'zod';
const loginValidationSchema = z.object({
  body: z.object({
    username: z.string({ required_error: 'Username is required.' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    currentPassword: z.string({
      required_error: 'Current password is required',
    }),
    newPassword: z.string({ required_error: 'Password is required' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    username: z.string({
      required_error: 'Username is required!',
    }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    username: z.string({
      required_error: 'Username is required!',
    }),
    newPassword: z.string({
      required_error: 'User password is required!',
    }),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
