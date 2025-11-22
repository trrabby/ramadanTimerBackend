import { Schema, model } from 'mongoose';
import { IBlog_Feedback } from './blogs_feedback.interface';

const BlogFeedbackSchema = new Schema<IBlog_Feedback>(
  {
    blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },

    feedback_by: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    feedback: { type: String },

    vote: { type: String, enum: ['like', 'dislike', null], default: null },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const BlogFeedbackModel = model<IBlog_Feedback>(
  'Blog_Feedback',
  BlogFeedbackSchema,
);
