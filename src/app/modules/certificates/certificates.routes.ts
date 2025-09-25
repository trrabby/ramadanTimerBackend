import express from 'express';
import auth from '../../MiddleWares/auth';
import { USER_ROLE } from '../users/user.constant';
import { multerUpload } from '../../config/multer.config';
import validateRequestFormdataMustPhotoArray from '../../MiddleWares/validateRequestFormdataMustPhotoArray';

import validateRequest from '../../MiddleWares/validateRequest';
import { CertificateValidations } from './experience.validation';
import { CertificateControllers } from './certificates.controller';

const router = express.Router();

router.post(
  '/add-certificate',
  multerUpload.array('files', 5),
  auth(USER_ROLE.admin),
  validateRequestFormdataMustPhotoArray(
    CertificateValidations.CertificateValidationSchema,
  ),
  CertificateControllers.create,
);

router.get('/', CertificateControllers.getAll);

router.patch(
  '/:id',
  multerUpload.array('files', 5),
  auth(USER_ROLE.admin),
  validateRequestFormdataMustPhotoArray(
    CertificateValidations.updateCertificateValidationSchema,
  ),
  CertificateControllers.updateOneById,
);

router.put(
  '/update-logo/:id',
  multerUpload.single('file'),
  auth(USER_ROLE.admin),
  validateRequest(CertificateValidations.updateCertificateValidationSchema),
  CertificateControllers.updateInstituteLogoById,
);

router.put(
  '/delete-certificate/:id',
  auth(USER_ROLE.admin),
  CertificateControllers.deleteOneById,
);

router.get('/:id', CertificateControllers.getOneById);

export const CertificateRoutes = router;
