import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser, UserModel>({
  username: {
    type: String,
    required: [true, 'username is required!'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'username is required!'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'password is required!'],
    trim: true,
    select: 0,
  },
  passwordChangedAt: {
    type: Date,
    trim: true,
    default: Date.now,
  },
  role: {
    type: String,
    required: [true, 'role is required!'],
    enum: ['user', 'admin'],
    default: 'user',
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Pre save middleware
userSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Check if the document is new
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds),
    );
  }
  next();
});

// Post save middleware to clear the password field
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExistsByCustomUsername = async function (
  username: string,
) {
  return await User.findOne({ username }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
