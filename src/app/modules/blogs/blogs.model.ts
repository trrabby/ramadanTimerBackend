import { Schema, model } from 'mongoose';
import { IBlog } from './blogs.interface';

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    authorImg: {
      type: String,
    },
    authorEmail: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },
    coverImage: {
      type: String,
    },
    thumbnails: {
      type: [String],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const BlogModel = model<IBlog>('Blog', BlogSchema);
