import express from 'express';
import auth from '../../MiddleWares/auth';
import { USER_ROLE } from '../users/user.constant';
import { multerUpload } from '../../config/multer.config';
import { ProjectControllers } from './project.controller';
import { projectValidations } from './project.validation';
import validateRequestFormdataMustPhotoArray from '../../MiddleWares/validateRequestFormdataMustPhotoArray';

const router = express.Router();

router.post(
  '/create-project',
  multerUpload.array('files', 5),
  auth(USER_ROLE.admin),
  validateRequestFormdataMustPhotoArray(
    projectValidations.projectValidationSchema,
  ),
  ProjectControllers.createProject,
);

router.get('/', ProjectControllers.getAllProjects);

router.patch(
  '/:id',
  multerUpload.array('files', 5),
  auth(USER_ROLE.admin),
  validateRequestFormdataMustPhotoArray(
    projectValidations.updateProjectValidationSchema,
  ),
  ProjectControllers.updateAProject,
);

router.put(
  '/delete-car/:id',
  auth(USER_ROLE.admin),
  ProjectControllers.deleteAProject,
);

router.get('/:id', auth(USER_ROLE.admin), ProjectControllers.getAProject);

export const projectRoutes = router;
