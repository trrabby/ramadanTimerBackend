import express from 'express';
import auth from '../../MiddleWares/auth';
import { USER_ROLE } from '../users/user.constant';
import validateRequestFormdata from '../../MiddleWares/validateRequestFormdata';
import { multerUpload } from '../../config/multer.config';
import { FeedbackSchema, updateFeedbackSchema } from './Feedback.validation';
import { FeedbackControllers } from './feedback.controller';

const router = express.Router();

/**
 * Create Feedback
 */
router.post(
  '/create-feedback',
  multerUpload.none(),
  validateRequestFormdata(FeedbackSchema),
  FeedbackControllers.create,
);

/**
 * Get All Feedback
 */
router.get('/', FeedbackControllers.getAll);

/**
 * Get One Feedback By ID
 */
router.get('/:id', FeedbackControllers.getOneById);

/**
 * Update Feedback
 */
router.patch(
  '/:id',
  multerUpload.none(),
  auth(USER_ROLE.admin),
  validateRequestFormdata(updateFeedbackSchema),
  FeedbackControllers.updateOneById,
);

/**
 * Delete Feedback (Hard Delete)
 */
router.delete('/:id', auth(USER_ROLE.admin), FeedbackControllers.deleteOneById);

export const FeedbackRoutes = router;
