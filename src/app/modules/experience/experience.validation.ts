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

const ExpericenceValidationSchema = z.object({
  body: z.object({
    category: z.string().min(1, 'Category is required'),
    institute: z.string().min(1, 'Institute name is required'),
    instituteLogo: z
      .string()
      .url('Institute logo must be a valid URL')
      .optional(),
    designation: z.string().min(1, 'Designation is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().nullable().optional(),
    currentlyWorking: z.boolean().nullable().optional(),
    details: z.string().min(1, 'Details are required'),
    thumbnails: z
      .array(multerFileSchema)
      .max(5, 'Maximum 5 thumbnails are allowed')
      .optional(),
    featured: z.boolean().optional(),
  }),
});

const updateExperienceValidationSchema = z.object({
  body: z.object({
    category: z.string().min(1, 'Category is required').optional(),
    institute: z.string().min(1, 'Institute name is required').optional(),
    instituteLogo: z
      .string()
      .url('Institute logo must be a valid URL')
      .optional(),
    designation: z.string().min(1, 'Designation is required').optional(),
    startDate: z.string().min(1, 'Start date is required').optional(),
    endDate: z.string().optional(),
    currentlyWorking: z.boolean().optional(),
    details: z.string().min(1, 'Details are required').optional(),
    thumbnails: z
      .array(z.string().url().or(multerFileSchema))
      .max(5, 'Maximum 5 thumbnails are allowed')
      .optional(),
    featured: z.boolean().optional(),
  }),
});

export const ExperienceValidations = {
  ExpericenceValidationSchema,
  updateExperienceValidationSchema,
};
