import express from 'express';

import { UserControllers } from './user.controller';
import auth from '../../MiddleWares/auth';
import { USER_ROLE } from './user.constant';
import { multerUpload } from '../../config/multer.config';
import { UserValidation } from './user.validation';
import validateRequestFormdata from '../../MiddleWares/validateRequestFormdataPhoto';

const router = express.Router();

router.post(
  '/register',
  multerUpload.single('file'),
  validateRequestFormdata(UserValidation.userValidationSchema),
  UserControllers.registerUser,
);

router.post('/registerViaProviders', UserControllers.registerUserViaProvider);

router.get('/', auth(USER_ROLE.admin), UserControllers.AllUsers);

router.get('/meByEmail/:email', UserControllers.getMyProfileByEmail);

router.get(
  '/me',
  auth(USER_ROLE.admin, USER_ROLE.editor, USER_ROLE.reader),
  UserControllers.getMyProfile,
);

router.patch(
  '/:email',
  multerUpload.single('file'),
  validateRequestFormdata(UserValidation.userUpdateValidationSchema),
  UserControllers.updateAUserFun,
);

router.patch(
  '/deleteUser/:id',
  auth(USER_ROLE.admin),
  UserControllers.deleteAUserFun,
);
export const UserRoutes = router;
