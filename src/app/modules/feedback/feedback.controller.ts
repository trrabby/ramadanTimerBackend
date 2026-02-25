/* eslint-disable @typescript-eslint/no-explicit-any */
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import customizedMsg from '../../utils/customisedMsg';
import AppError from '../../errorHandlers/AppError';
import { USER_ROLE } from '../users/user.constant';
import { FeedbackServices } from './Feedback.services';

/**
 * Create Feedback
 */
const create = catchAsync(async (req, res) => {
  const data = JSON.parse(req.body.data);

  if (!data.feedback || data.feedback.trim() === '') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Feedback cannot be empty');
  }

  const result = await FeedbackServices.create(data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Feedback submitted successfully',
    data: result,
  });
});

/**
 * Get All Feedback
 */
const getAll = catchAsync(async (req, res) => {
  const result = await FeedbackServices.getAll(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: customizedMsg(result?.result, 'Feedbacks'),
    data: result,
  });
});

/**
 * Get One Feedback By ID
 */
const getOneById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await FeedbackServices.getOneById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Feedback not found');
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedback retrieved successfully',
    data: result,
  });
});

/**
 * Update Feedback
 */
const updateOneById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { feedback } = JSON.parse(req.body.data);

  if (!feedback || feedback.trim() === '') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Feedback cannot be empty');
  }

  const existingFeedback = await FeedbackServices.getOneById(id);

  if (!existingFeedback) {
    throw new AppError(httpStatus.NOT_FOUND, 'Feedback not found');
  }

  const sameAuthor =
    existingFeedback.email && existingFeedback.email === req?.user?.email;

  if (req?.user?.role !== USER_ROLE.admin && !sameAuthor) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to update this feedback',
    );
  }

  const result = await FeedbackServices.updateOneById(id, {
    feedback,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedback updated successfully',
    data: result,
  });
});

/**
 * Delete Feedback (Hard Delete)
 */
const deleteOneById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const existingFeedback = await FeedbackServices.getOneById(id);

  if (!existingFeedback) {
    throw new AppError(httpStatus.NOT_FOUND, 'Feedback not found');
  }

  const sameAuthor =
    existingFeedback.email && existingFeedback.email === req?.user?.email;

  if (req?.user?.role !== USER_ROLE.admin && !sameAuthor) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to delete this feedback',
    );
  }

  await FeedbackServices.deleteOneById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedback deleted successfully',
    data: null,
  });
});

export const FeedbackControllers = {
  create,
  getAll,
  getOneById,
  updateOneById,
  deleteOneById,
};
