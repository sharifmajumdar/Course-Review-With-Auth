import { Types } from 'mongoose';

export type TTags = {
  name: string;
  isDeleted: boolean;
};

export type TDetails = {
  level: string;
  description: string;
};

export type TCourse = {
  title: string;
  instructor: string;
  categoryId: Types.ObjectId;
  price: number;
  tags?: Partial<TTags[]>;
  startDate: string;
  endDate: string;
  language: string;
  provider: string;
  durationInWeeks?: number;
  details?: Partial<TDetails>; // Optional field
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};
