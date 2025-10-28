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

const projectValidationSchema = z.object({
  body: z.object({
    projTitle: z.string().min(1, 'Project title is required'),
    liveLInk: z.string().url('Live link must be a valid URL'),
    serverLink: z.string().url('Server link must be a valid URL'),
    clientLink: z.string().url('Client link must be a valid URL'),
    shortDescription: z.string().min(1, 'Short description is required'),
    descriptionOfProject: z
      .string()
      .min(1, 'Description of project is required'),
    stackUsed: z
      .array(z.string())
      .min(1, 'At least one technology is required'),
    thumbnails: z
      .array(multerFileSchema)
      .min(1, 'At least one thumbnail is required')
      .max(5, 'Maximum 5 thumbnails are allowed'),
    specialRemarks: z.string().optional(),
    featured: z.boolean().optional(),
  }),
});

const updateProjectValidationSchema = z.object({
  body: z.object({
    projTitle: z.string().min(1, 'Project title is required').optional(),
    liveLInk: z.string().url('Live link must be a valid URL').optional(),
    serverLink: z.string().url('Server link must be a valid URL').optional(),
    clientLink: z.string().url('Client link must be a valid URL').optional(),
    shortDescription: z
      .string()
      .min(1, 'Short description is required')
      .optional(),
    descriptionOfProject: z
      .string()
      .min(1, 'Description of project is required')
      .optional(),
    stackUsed: z
      .array(z.string())
      .min(1, 'At least one technology is required')
      .optional(),
    thumbnails: z
      .array(z.string().url().or(multerFileSchema))
      .max(5, 'Maximum 5 thumbnails are allowed')
      .refine((arr) => arr === undefined || arr.length > 0, {
        message: 'At least one thumbnail is required',
      }),
    specialRemarks: z.string().optional(),
    featured: z.boolean().optional(),
  }),
});

export const projectValidations = {
  projectValidationSchema,
  updateProjectValidationSchema,
};
