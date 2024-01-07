/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  username: string;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  role: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
}

export interface UserModel extends Model<TUser> {
  isUserExistsByCustomUsername(username: string): Promise<TUser | null>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;

  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
