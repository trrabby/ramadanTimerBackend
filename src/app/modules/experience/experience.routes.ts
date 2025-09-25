import express from 'express';
import auth from '../../MiddleWares/auth';
import { USER_ROLE } from '../users/user.constant';
import { multerUpload } from '../../config/multer.config';
import validateRequestFormdataMustPhotoArray from '../../MiddleWares/validateRequestFormdataMustPhotoArray';
import { ExperienceValidations } from './experience.validation';
import { ExperienceControllers } from './experiece.controller';
import validateRequest from '../../MiddleWares/validateRequest';

const router = express.Router();

router.post(
  '/create-experience',
  multerUpload.array('files', 5),
  auth(USER_ROLE.admin),
  validateRequestFormdataMustPhotoArray(
    ExperienceValidations.ExpericenceValidationSchema,
  ),
  ExperienceControllers.create,
);

router.get('/', ExperienceControllers.getAll);

router.patch(
  '/:id',
  multerUpload.array('files', 5),
  auth(USER_ROLE.admin),
  validateRequestFormdataMustPhotoArray(
    ExperienceValidations.updateExperienceValidationSchema,
  ),
  ExperienceControllers.updateOneById,
);

router.put(
  '/update-logo/:id',
  multerUpload.single('file'),
  auth(USER_ROLE.admin),
  validateRequest(ExperienceValidations.updateExperienceValidationSchema),
  ExperienceControllers.updateInstituteLogoById,
);

router.put(
  '/delete-experience/:id',
  auth(USER_ROLE.admin),
  ExperienceControllers.deleteOneById,
);

router.get('/:id', ExperienceControllers.getOneById);

export const ExperienceRoutes = router;
