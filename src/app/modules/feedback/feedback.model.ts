import { Schema, model } from 'mongoose';
import { IFeedback } from './feedback.interface';

const BlogFeedbackSchema = new Schema<IFeedback>(
  {
    author: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
    },

    feedback: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // automatically creates createdAt & updatedAt
  },
);

export const FeedbackModel = model<IFeedback>('Feedback', BlogFeedbackSchema);
