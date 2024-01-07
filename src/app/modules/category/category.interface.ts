import { Types } from 'mongoose';

export type TCategory = {
  name: string;
  createdBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TCreatedBy = {
  _id: Types.ObjectId;
  username: string;
  email: string;
  role: string;
};

export type TResponseCategory = {
  _id: Types.ObjectId;
  name: string;
  createdBy: TCreatedBy;
  createdAt: Date;
  updatedAt: Date;
};
