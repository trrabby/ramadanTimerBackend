import { Schema, model } from 'mongoose';
import { IBlog_Feedback } from './blogs_feedback.interface';

const BlogFeedbackSchema = new Schema<IBlog_Feedback>(
  {
    blog: { type: Schema.Types.ObjectId, ref: 'Blog' },

    feedback_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    feedback: [
      {
        text: { type: String },
        createdAt: { type: Date },
        isDeleted: { type: Boolean, default: false },
        updatedAt: { type: Date },
      },
    ],
    vote: { type: String, enum: ['like', 'dislike', null], default: null },
  },
  {
    timestamps: true,
  },
);

export const BlogFeedbackModel = model<IBlog_Feedback>(
  'Blog_Feedback',
  BlogFeedbackSchema,
);
