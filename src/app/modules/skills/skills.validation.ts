import { z } from 'zod';
import { SkillsModel } from './skills.model';

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

const skillsValidationSchema = z.object({
  body: z.object({
    imgUrl: z
      .union([z.string().url(), multerFileSchema])
      .refine(
        (val) =>
          (typeof val === 'string' && val.length > 0) ||
          (typeof val === 'object' && val !== null),
        {
          message: 'Logo is required',
        },
      ),
    skillName: z
      .string()
      .min(1, 'Skill name is required')
      .refine(
        async (name) => {
          const exists = await SkillsModel.exists({ skillName: name });
          return !exists;
        },
        {
          message: 'Skill name must be unique',
        },
      ),
    genre: z.enum(
      [
        'programming_language',
        'frontend',
        'backend',
        'database',
        'devops',
        'tools',
        'other',
      ],
      {
        required_error:
          'Genre is required, Values should be one of frontend, backend, database, devops, tools, other',
        invalid_type_error:
          'Genre is required, Values should be one of frontend, backend, database, devops, tools, other',
      },
    ),
    description: z.string().optional(),
  }),
});

const updateSkillsValidationSchema = z.object({
  body: z.object({
    imgUrl: z.union([z.string().url(), multerFileSchema]).optional(),
    skillName: z
      .string()
      .min(1, 'Skill name is required')
      .refine(
        async (name) => {
          const exists = await SkillsModel.exists({ skillName: name });
          return !exists;
        },
        {
          message: `This skill already exists. Please add unique skill.`,
        },
      )
      .optional(),
    genre: z
      .enum(
        [
          'programming_language',
          'frontend',
          'backend',
          'database',
          'devops',
          'tools',
          'other',
        ],
        {
          invalid_type_error:
            'Genre is required, Values should be one of frontend, backend, database, devops, tools, other',
        },
      )
      .optional(),

    description: z.string().optional(),
  }),
});

export const SkillsValidations = {
  skillsValidationSchema,
  updateSkillsValidationSchema,
};
