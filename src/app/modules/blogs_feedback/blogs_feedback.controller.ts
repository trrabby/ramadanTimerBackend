/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import customizedMsg from '../../utils/customisedMsg';
import AppError from '../../errorHandlers/AppError';
import { USER_ROLE } from '../users/user.constant';
import { BlogsFeedbackServices } from './blogs_Feedback.services';

const create = catchAsync(async (req, res) => {
  const data = JSON.parse(req.body.data);
  const result = await BlogsFeedbackServices.create(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Feedback submitted successfully`,
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  // console.log(req.cookies);
  const result = await BlogsFeedbackServices.getAll(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: customizedMsg(result?.result, 'Feedbacks'),
    data: result,
  });
});

const updateOneById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = JSON.parse(req.body.data);
  const feedbackToBeUpdated = await BlogsFeedbackServices?.getOneById(id);
  const author = feedbackToBeUpdated[0].feedback_by as {
    name: string;
    email: string;
    imgUrl: string;
    role: string;
  };

  const sameAuthor = author?.email === req?.user?.email;
  // console.log(sameAuthor);
  if (req?.user?.role !== USER_ROLE.admin && !sameAuthor) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to update this feedback',
    );
  }
  // console.log(payLoad);
  const result = await BlogsFeedbackServices.updateOneById(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Feedback Updated Successfully`,
    data: result,
  });
});

const deleteOneById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const feedbackToBeUpdated = await BlogsFeedbackServices?.getOneById(id);
  const author = feedbackToBeUpdated[0].feedback_by as {
    name: string;
    email: string;
    imgUrl: string;
    role: string;
  };

  const sameAuthor = author?.email === req?.user?.email;

  if (req?.user?.role !== USER_ROLE.admin && !sameAuthor) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to delete this feedback',
    );
  }
  const result = await BlogsFeedbackServices.deleteOneById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedback Deleted Successfully',
    data: result,
  });
});

const getOneById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BlogsFeedbackServices.getOneById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedback Retrived Successfully',
    data: result,
  });
});

export const BlogsFeedbackControllers = {
  create,
  getAll,
  updateOneById,
  deleteOneById,
  getOneById,
};
