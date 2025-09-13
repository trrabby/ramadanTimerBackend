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
  }),
  files: z
    .array(multerFileSchema)
    .min(1, 'At least one thumbnail is required')
    .max(5),
});

const updateProjectValidationSchema = z.object({
  body: z.object({
    projTitle: z.string().optional(),
    liveLInk: z.string().url('Live link must be a valid URL').optional(),
    serverLink: z.string().url('Server link must be a valid URL').optional(),
    clientLink: z.string().url('Client link must be a valid URL').optional(),
    shortDescription: z.string().optional(),
    descriptionOfProject: z.string().optional(),
    thumbnails: z
      .array(z.string().url('Thumbnail must be a valid URL'))
      .optional(),
  }),
});

export const projectValidations = {
  projectValidationSchema,
  updateProjectValidationSchema,
};
