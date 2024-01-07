import { TReview } from './review.interface';
import { Schema, model } from 'mongoose';

const reviewSchema = new Schema<TReview>({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
  rating: {
    type: String,
    enum: ['1', '2', '3', '4', '5'],
    trim: true,
    required: [true, 'Rating is required!'],
  },
  review: {
    type: String,
    trim: true,
    required: [true, 'Comment is required!'],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Review = model<TReview>('Review', reviewSchema);
