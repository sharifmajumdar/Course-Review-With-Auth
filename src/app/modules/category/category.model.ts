import { Schema, model } from 'mongoose';
import { TCategory } from './category.interface';

const categorySchema = new Schema<TCategory>({
  name: {
    type: String,
    required: [true, 'Category name is required!'],
    unique: true,
    maxlength: [20, 'Category name can not be more than 20 characters'],
    trim: true,
    validate: {
      validator: function (value: string) {
        // A function to make the string as captalized
        const name = value.charAt(0).toUpperCase() + value.slice(1);
        return name === value;
      },
      message: '{VALUE} is not in capitalized format',
    },
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

export const Category = model<TCategory>('Category', categorySchema);
