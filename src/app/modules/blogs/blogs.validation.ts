import { z } from 'zod';

const multerFileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string().startsWith('image/'), // Only images
  destination: z.string().optional(),
  filename: z.string(),
  path: z.string(),
  size: z.number().max(2 * 1024 * 1024, 'File too large'), // 2MB limit
});

const BlogsValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Blog title is required'),
    category: z.string().min(1, 'Category is required'),
    tags: z
      .array(z.string().min(1, 'Tag cannot be empty'))
      .min(1, 'At least one tag is required'),
    content: z.string().min(1, 'Content is required'),
    coverImage: z.string().url('Cover image must be a valid URL').optional(),
    thumbnails: z
      .array(multerFileSchema)
      .min(1, 'At least one thumbnail is required')
      .max(5, 'Maximum 5 thumbnails are allowed'),
    featured: z.boolean().optional(),
  }),
});

const updateBlogsValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Blog title is required').optional(),
    category: z.string().min(1, 'Category is required').optional(),
    tags: z
      .array(z.string().min(1, 'Tag cannot be empty'))
      .min(1, 'At least one tag is required')
      .optional(),
    content: z.string().min(1, 'Content is required').optional(),
    coverImage: z.string().url('Cover image must be a valid URL').optional(),
    thumbnails: z
      .array(z.string().url().or(multerFileSchema))
      .max(5, 'Maximum 5 thumbnails are allowed')
      .refine((arr) => arr === undefined || arr.length > 0, {
        message: 'At least one thumbnail is required',
      }),
    featured: z.boolean().optional(),
  }),
});

export const BlogsValidations = {
  BlogsValidationSchema,
  updateBlogsValidationSchema,
};
