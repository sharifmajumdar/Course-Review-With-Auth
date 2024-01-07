import { TCourse, TDetails, TTags } from './course.interface';
import { Schema, model } from 'mongoose';

const tagsSchema = new Schema<TTags>({
  name: {
    type: String,
    trim: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const detailsSchema = new Schema<TDetails>({
  level: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    required: [true, 'Title is required!'],
    unique: true,
    maxlength: [30, 'Category name can not be more than 30 characters'],
    trim: true,
    validate: {
      validator: function (value: string) {
        const name = value.charAt(0).toUpperCase() + value.slice(1);
        return name === value;
      },
      message: '{VALUE} is not in capitalized format',
    },
  },
  instructor: {
    type: String,
    required: [true, 'Instructor is required!'],
    maxlength: [25, 'Instructor name can not be more than 25 characters'],
    trim: true,
    validate: {
      validator: function (value: string) {
        const name = value.charAt(0).toUpperCase() + value.slice(1);
        return name === value;
      },
      message: '{VALUE} is not in capitalized format',
    },
  },
  categoryId: {
    type: Schema.Types.ObjectId, // Mongoose object Id
    ref: 'Category',
  },
  price: {
    type: Number,
    trim: true,
    required: [true, 'Course price is required!'],
  },
  tags: {
    type: [tagsSchema],
    trim: true,
  },
  startDate: {
    type: String,
    required: [true, 'Star date required!'],
    trim: true,
  },
  endDate: {
    type: String,
    required: [true, 'End date required!'],
    trim: true,
  },
  language: {
    type: String,
    required: [true, 'Language required!'],
    trim: true,
  },
  provider: {
    type: String,
    required: [true, 'Course provider required!'],
    trim: true,
  },
  durationInWeeks: {
    type: Number,
  },
  details: {
    type: detailsSchema,
    trim: true,
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

export const Course = model<TCourse>('Course', courseSchema);
