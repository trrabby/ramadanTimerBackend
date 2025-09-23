import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import customizedMsg from '../../utils/customisedMsg';
import { SkillsServices } from './skills.services';

const AddSkill = catchAsync(async (req, res) => {
  const data = JSON.parse(req.body.data);
  const imgUrl = req.file?.path;
  const payLoad = { ...data, imgUrl };
  // console.log(payLoad);
  const result = await SkillsServices.createProject(payLoad);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Skill added successfully`,
    data: result,
  });
});

const getAllSkills = catchAsync(async (req, res) => {
  const result = await SkillsServices.getAllSkills(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: customizedMsg(result?.result, 'Skills'),
    data: result,
  });
});

const updateASkill = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = JSON.parse(req.body.data);
  const logo = req.file?.path;
  const payLoad = { ...data, logo };
  // console.log(payLoad);
  const result = await SkillsServices.updateSkill(id, payLoad);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Skill Updated Successfully`,
    data: result,
  });
});

const deleteASkill = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SkillsServices.deleteSkill(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Skill Deleted Successfully',
    data: result,
  });
});

export const SkillsControllers = {
  AddSkill,
  getAllSkills,
  updateASkill,
  deleteASkill,
};
