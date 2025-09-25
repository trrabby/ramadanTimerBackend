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

const CertificateValidationSchema = z.object({
  body: z.object({
    category: z.enum(['academic', 'non-academic', 'professional'], {
      required_error: 'Category is required',
      invalid_type_error:
        'Category must be one of academic, non-academic, professional',
    }),
    institute: z.string().min(1, 'Institute name is required'),
    instituteLogo: z
      .string()
      .url('Institute logo must be a valid URL')
      .optional(),
    nameOfDegree: z.string().min(1, 'Name of degree is required'),
    nameOfMajor: z.string().optional(),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().nullable().optional(),
    currentlyStuding: z.boolean().nullable().optional(),
    certificateLink: z
      .string()
      .url('Certificate link must be a valid URL')
      .optional(),
    credentialLink: z
      .string()
      .url('Credential link must be a valid URL')
      .optional(),
    details: z.string().min(1, 'Details are required'),
    thumbnails: z
      .array(multerFileSchema)
      .max(5, 'Maximum 5 thumbnails are allowed')
      .optional(),
    featured: z.boolean().optional(),
  }),
});

const updateCertificateValidationSchema = z.object({
  body: z.object({
    category: z
      .enum(['academic', 'non-academic', 'professional'], {
        invalid_type_error:
          'Category must be one of academic, non-academic, professional',
      })
      .optional(),
    institute: z.string().min(1, 'Institute name is required').optional(),
    instituteLogo: z
      .string()
      .url('Institute logo must be a valid URL')
      .optional(),
    nameOfDegree: z.string().min(1, 'Name of degree is required').optional(),
    nameOfMajor: z.string().optional(),
    startDate: z.string().min(1, 'Start date is required').optional(),
    endDate: z.string().nullable().optional(),
    currentlyStuding: z.boolean().nullable().optional(),
    certificateLink: z
      .string()
      .url('Certificate link must be a valid URL')
      .optional(),
    credentialLink: z
      .string()
      .url('Credential link must be a valid URL')
      .optional(),
    details: z.string().min(1, 'Details are required').optional(),
    thumbnails: z
      .array(z.string().url().or(multerFileSchema))
      .max(5, 'Maximum 5 thumbnails are allowed')
      .optional(),
    featured: z.boolean().optional(),
  }),
});

export const CertificateValidations = {
  CertificateValidationSchema,
  updateCertificateValidationSchema,
};
