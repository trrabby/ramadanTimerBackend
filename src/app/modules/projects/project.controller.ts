import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { ProjectServices } from './project.services';
import customizedMsg from '../../utils/customisedMsg';

const createProject = catchAsync(async (req, res) => {
  const data = JSON.parse(req.body.data);
  const thumbnails = Array.isArray(req.files)
    ? req.files.map((file) => file.path)
    : [];

  const payLoad = { ...data, thumbnails };
  // console.log(payLoad);

  const result = await ProjectServices.createProject(payLoad);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Project's Data created successfully`,
    data: result,
  });
});

const getAllProjects = catchAsync(async (req, res) => {
  // console.log(req.cookies);
  const result = await ProjectServices.getAllProjects(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: customizedMsg(result?.result, 'Projects'),
    data: result,
  });
});

const updateAProject = catchAsync(async (req, res) => {
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
  const result = await ProjectServices.updateAProject(id, payLoad);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Project Updated Successfully`,
    data: result,
  });
});

const deleteAProject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProjectServices.deleteAProject(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project Deleted Successfully',
    data: result,
  });
});

const getAProject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProjectServices.getAProject(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project Retrived Successfully',
    data: result,
  });
});

export const ProjectControllers = {
  createProject,
  getAllProjects,
  updateAProject,
  deleteAProject,
  getAProject,
};
