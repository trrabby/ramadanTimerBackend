import { z } from 'zod';

export const BlogFeedbackSchema = z.object({
  body: z.object({
    blog: z.string(), // required

    feedback_by: z.string(), // required

    feedback: z.string().optional(),

    vote: z.enum(['like', 'dislike']).nullable().optional(),

    isDeleted: z.boolean().optional(),
  }),
});

export const updateBlogFeedbackSchema = z.object({
  body: z.object({
    blog: z.string().optional(),
    feedback_by: z.string().optional(),

    feedback: z.string().optional(),

    vote: z.enum(['like', 'dislike']).nullable().optional(),

    isDeleted: z.boolean().optional(),
  }),
});

export const BlogFeedbackValidations = {
  BlogFeedbackSchema,
  updateBlogFeedbackSchema,
};
