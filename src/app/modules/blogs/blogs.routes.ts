import express from 'express';
import auth from '../../MiddleWares/auth';
import { USER_ROLE } from '../users/user.constant';
import { multerUpload } from '../../config/multer.config';
import { BlogsControllers } from './blogs.controller';
import validateRequestFormdataMustPhotoArray from '../../MiddleWares/validateRequestFormdataMustPhotoArray';
import { BlogsValidations } from './blogs.validation';

const router = express.Router();

router.post(
  '/create-blog',
  multerUpload.array('files', 5),
  auth(USER_ROLE.admin, USER_ROLE.editor, USER_ROLE.reader),
  validateRequestFormdataMustPhotoArray(BlogsValidations.BlogsValidationSchema),
  BlogsControllers.create,
);

router.get('/', BlogsControllers.getAll);

router.patch(
  '/:id',
  multerUpload.array('files', 5),
  auth(USER_ROLE.admin, USER_ROLE.editor, USER_ROLE.reader),
  validateRequestFormdataMustPhotoArray(
    BlogsValidations.updateBlogsValidationSchema,
  ),
  BlogsControllers.updateOneById,
);

router.put(
  '/update-cover/:id',
  multerUpload.none(),
  auth(USER_ROLE.admin, USER_ROLE.editor, USER_ROLE.reader),
  BlogsControllers.updateCoverPhotoById,
);

router.put(
  '/delete-blog/:id',
  auth(USER_ROLE.admin, USER_ROLE.editor, USER_ROLE.reader),
  BlogsControllers.deleteOneById,
);

router.put(
  '/restore-blog/:id',
  auth(USER_ROLE.admin, USER_ROLE.editor, USER_ROLE.reader),
  BlogsControllers.restoreOneById,
);

router.get('/:id', BlogsControllers.getOneById);

export const BlogRoutes = router;
