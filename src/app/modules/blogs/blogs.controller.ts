/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import customizedMsg from '../../utils/customisedMsg';
import { BlogsServices } from './blogs.services';
import AppError from '../../errorHandlers/AppError';
import { USER_ROLE } from '../users/user.constant';
import { UserServices } from '../users/user.services';

const create = catchAsync(async (req, res) => {
  const data = JSON.parse(req.body.data);

  const thumbnails = Array.isArray(req.files)
    ? req.files.map((file) => file.path)
    : [];

  const coverImage = thumbnails.length > 0 ? thumbnails[0] : '';
  const user = await UserServices.getMyProfile(req.user.email);
  const author = user._id;
  const isPublished = user.role === USER_ROLE.admin ? true : false;

  const payLoad = { ...data, author, coverImage, thumbnails, isPublished };
  // console.log(payLoad);

  const result = await BlogsServices.create(payLoad);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Blog created successfully`,
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  // console.log(req.cookies);
  const result = await BlogsServices.getAll(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: customizedMsg(result?.result, 'Blogs'),
    data: result,
  });
});

const updateOneById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = JSON.parse(req.body.data);
  const blogToBeUpdated = await BlogsServices?.getOneById(id);
  const author = blogToBeUpdated[0].author as {
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
      'You are not authorized to update this blog',
    );
  }

  const thumbnails: string[] = data.previousUploadedImg || [];
  delete data.previousUploadedImg;
  const coverImage =
    thumbnails.length > 0 ? thumbnails[0] : blogToBeUpdated[0].coverImage;
  const newUploadedImgUrl = Array.isArray(req.files)
    ? req.files.map((file) => file.path)
    : [];
  if (newUploadedImgUrl.length > 0) {
    thumbnails.push(...newUploadedImgUrl);
  }
  const payLoad = { ...data, coverImage, thumbnails };
  // console.log(payLoad);
  const result = await BlogsServices.updateOneById(id, payLoad);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Blog Updated Successfully`,
    data: result,
  });
});

const updateCoverPhotoById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = JSON.parse(req.body.data);
  const blogToBeUpdated = await BlogsServices?.getOneById(id);
  const author = blogToBeUpdated[0].author as {
    name: string;
    email: string;
    imgUrl: string;
    role: string;
  };

  const sameAuthor = author?.email === req?.user?.email;

  if (req?.user?.role !== USER_ROLE.admin && !sameAuthor) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to update this cover photo',
    );
  }
  const result = await BlogsServices.updateOneById(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Cover Photo Updated Successfully`,
    data: result,
  });
});

const deleteOneById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const blogToBeDeleted = await BlogsServices?.getOneById(id);
  const author = blogToBeDeleted[0].author as {
    name: string;
    email: string;
    imgUrl: string;
    role: string;
  };

  const sameAuthor = author?.email === req?.user?.email;

  if (req?.user?.role !== USER_ROLE.admin && !sameAuthor) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to delete this blog',
    );
  }
  const result = await BlogsServices.deleteOneById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog Deleted Successfully',
    data: result,
  });
});

const getOneById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BlogsServices.getOneById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog Retrived Successfully',
    data: result,
  });
});

export const BlogsControllers = {
  create,
  getAll,
  updateOneById,
  updateCoverPhotoById,
  deleteOneById,
  getOneById,
};
