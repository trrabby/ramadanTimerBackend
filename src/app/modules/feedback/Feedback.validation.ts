import { z } from 'zod';

/**
 * Create Feedback Validation
 */
export const FeedbackSchema = z.object({
  body: z.object({
    author: z
      .string({
        required_error: 'Author is required',
      })
      .min(1, 'Author cannot be empty')
      .trim(),

    email: z.string().email('Invalid email format').optional(),

    feedback: z
      .string({
        required_error: 'Feedback is required',
      })
      .min(1, 'Feedback cannot be empty')
      .trim(),
    rating: z
      .number({
        required_error: 'Rating is required',
      })
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating cannot be more than 5'),
  }),
});

/**
 * Update Feedback Validation
 * (Partial update allowed)
 */
export const updateFeedbackSchema = z.object({
  body: z.object({
    author: z.string().min(1).trim().optional(),

    email: z.string().email('Invalid email format').optional(),

    feedback: z.string().min(1, 'Feedback cannot be empty').trim().optional(),

    rating: z
      .number()
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating cannot be more than 5')
      .optional(),
  }),
});

export const FeedbackValidations = {
  FeedbackSchema,
  updateFeedbackSchema,
};
