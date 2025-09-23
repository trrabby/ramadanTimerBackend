import express from 'express';
import auth from '../../MiddleWares/auth';
import { USER_ROLE } from '../users/user.constant';
import { multerUpload } from '../../config/multer.config';
import { SkillsValidations } from './skills.validation';
import { SkillsControllers } from './skills.controller';
import validateRequestFormdataPhoto from '../../MiddleWares/validateRequestFormdataPhoto';

const router = express.Router();

router.post(
  '/add-skill',
  auth(USER_ROLE.admin),
  multerUpload.single('file'),
  validateRequestFormdataPhoto(SkillsValidations.skillsValidationSchema),
  SkillsControllers.AddSkill,
);

router.get('/', SkillsControllers.getAllSkills);

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  multerUpload.single('file'),
  validateRequestFormdataPhoto(SkillsValidations.updateSkillsValidationSchema),
  SkillsControllers.updateASkill,
);

router.put(
  '/delete-skill/:id',
  auth(USER_ROLE.admin),
  SkillsControllers.deleteASkill,
);

export const skillsRoutes = router;
