import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import customizedMsg from '../../utils/customisedMsg';
import { ExperieceServices } from './experience.services';

const create = catchAsync(async (req, res) => {
  const data = JSON.parse(req.body.data);

  const thumbnails = Array.isArray(req.files)
    ? req.files.map((file) => file.path)
    : [];

  const payLoad = { ...data, thumbnails };
  // console.log(payLoad);

  const result = await ExperieceServices.create(payLoad);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Expericence created successfully`,
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  // console.log(req.cookies);
  const result = await ExperieceServices.getAll(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: customizedMsg(result?.result, 'Experiences'),
    data: result,
  });
});

const updateOneById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = JSON.parse(req.body.data);
  const thumbnails: string[] = data.previousUploadedImg || [];
  delete data.previousUploadedImg;

  const newUploadedImgUrl = Array.isArray(req.files)
    ? req.files.map((file) => file.path)
    : [];
  if (newUploadedImgUrl.length > 0) {
    thumbnails.push(...newUploadedImgUrl);
  }
  const payLoad = { ...data, thumbnails };
  // console.log(payLoad);
  const result = await ExperieceServices.updateOneById(id, payLoad);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Expericence Updated Successfully`,
    data: result,
  });
});

const updateInstituteLogoById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const instituteLogo = req.file?.path;

  const result = await ExperieceServices.updateOneById(
    id,
    instituteLogo ? { instituteLogo } : {},
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Institute Logo Updated Successfully`,
    data: result,
  });
});

const deleteOneById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ExperieceServices.deleteOneById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Experience Deleted Successfully',
    data: result,
  });
});

const getOneById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ExperieceServices.getOneById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog Retrived Successfully',
    data: result,
  });
});

export const ExperienceControllers = {
  create,
  getAll,
  updateOneById,
  updateInstituteLogoById,
  deleteOneById,
  getOneById,
};
