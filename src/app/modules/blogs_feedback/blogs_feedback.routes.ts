import express from 'express';
import auth from '../../MiddleWares/auth';
import { USER_ROLE } from '../users/user.constant';
import { BlogsFeedbackControllers } from './blogs_feedback.controller';
import validateRequestFormdata from '../../MiddleWares/validateRequestFormdata';
import { multerUpload } from '../../config/multer.config';
import {
  BlogFeedbackSchema,
  updateBlogFeedbackSchema,
} from './blogs_Feedback.validation';

const router = express.Router();

router.post(
  '/create-feedback',
  multerUpload.none(),
  auth(USER_ROLE.admin, USER_ROLE.editor, USER_ROLE.reader),
  validateRequestFormdata(BlogFeedbackSchema),
  BlogsFeedbackControllers.create,
);

router.get('/', BlogsFeedbackControllers.getAll);

router.patch(
  '/:id',
  multerUpload.none(),
  auth(USER_ROLE.admin, USER_ROLE.editor, USER_ROLE.reader),
  validateRequestFormdata(updateBlogFeedbackSchema),
  BlogsFeedbackControllers.updateOneById,
);

router.put(
  '/delete-feedback/:id',
  auth(USER_ROLE.admin, USER_ROLE.editor, USER_ROLE.reader),
  BlogsFeedbackControllers.deleteOneById,
);

router.get('/:id', BlogsFeedbackControllers.getOneById);

router.get(
  '/blog-wise-feedback/:id',
  BlogsFeedbackControllers.getFeedbackForBlog,
);
router.get('/single-feedback/:id', BlogsFeedbackControllers.getOneByFeedbackId);

export const BlogFeedbackRoutes = router;
