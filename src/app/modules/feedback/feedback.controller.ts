/* eslint-disable @typescript-eslint/no-explicit-any */
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import customizedMsg from '../../utils/customisedMsg';
import AppError from '../../errorHandlers/AppError';
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
  const payload = JSON.parse(req.body.data);
  // console.log(payload);

  if (!payload.feedback || payload.feedback.trim() === '') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Feedback cannot be empty');
  }
  const result = await FeedbackServices.updateOneById(id, payload);

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

  const result = await FeedbackServices.deleteOneById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedback deleted successfully',
    data: result,
  });
});

export const FeedbackControllers = {
  create,
  getAll,
  getOneById,
  updateOneById,
  deleteOneById,
};
