import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import customizedMsg from '../../utils/customisedMsg';
import { CertificateServices } from './certificates.services';

const create = catchAsync(async (req, res) => {
  const data = JSON.parse(req.body.data);

  const thumbnails = Array.isArray(req.files)
    ? req.files.map((file) => file.path)
    : [];

  const payLoad = { ...data, thumbnails };
  // console.log(payLoad);

  const result = await CertificateServices.create(payLoad);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Certificate added successfully`,
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  // console.log(req.cookies);
  const result = await CertificateServices.getAll(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: customizedMsg(result?.result, 'Certificates'),
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
  const result = await CertificateServices.updateOneById(id, payLoad);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Certificate Updated Successfully`,
    data: result,
  });
});

const updateInstituteLogoById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const instituteLogo = req.file?.path;

  const result = await CertificateServices.updateOneById(
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
  const result = await CertificateServices.deleteOneById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certificate Deleted Successfully',
    data: result,
  });
});

const getOneById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CertificateServices.getOneById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certificate Retrived Successfully',
    data: result,
  });
});

export const CertificateControllers = {
  create,
  getAll,
  updateOneById,
  updateInstituteLogoById,
  deleteOneById,
  getOneById,
};
