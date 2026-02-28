import express from 'express';
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
  validateRequestFormdata(updateFeedbackSchema),
  FeedbackControllers.updateOneById,
);

/**
 * Delete Feedback (Hard Delete)
 */
router.delete('/:id', FeedbackControllers.deleteOneById);

export const FeedbackRoutes = router;
