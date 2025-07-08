import { z } from 'zod';

const projectValidationSchema = z.object({
  projTitle: z.string().min(1, 'Project title is required'),
  liveLInk: z.string().url('Live link must be a valid URL'),
  serverLink: z.string().url('Server link must be a valid URL'),
  clientLink: z.string().url('Client link must be a valid URL'),
  shortDescription: z.string().min(1, 'Short description is required'),
  descriptionOfProject: z.string().min(1, 'Description of project is required'),
  thumbnails: z
    .array(z.string().url('Thumbnail must be a valid URL'))
    .nonempty('At least one thumbnail is required'),
});

const updateProjectValidationSchema = z.object({
  projTitle: z.string().optional(),
  liveLInk: z.string().url('Live link must be a valid URL').optional(),
  serverLink: z.string().url('Server link must be a valid URL').optional(),
  clientLink: z.string().url('Client link must be a valid URL').optional(),
  shortDescription: z.string().optional(),
  descriptionOfProject: z.string().optional(),
  thumbnails: z
    .array(z.string().url('Thumbnail must be a valid URL'))
    .optional(),
});

export const projectValidations = {
  projectValidationSchema,
  updateProjectValidationSchema,
};
