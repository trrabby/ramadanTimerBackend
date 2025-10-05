import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import customizedMsg from '../../utils/customisedMsg';
import { verifyGoogleToken } from '../../utils/ProvidersTokenVerify';
import { IUser } from './user.interface';

const registerUser = catchAsync(async (req, res) => {
  const data = JSON.parse(req.body.data);
  const imgUrl = req.file?.path;

  const user = await UserServices.registerNewUserIntoDB({
    ...data,
    imgUrl,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${user.user.role} is created successfully`,
    data: user,
  });
});

const registerUserViaProvider = catchAsync(async (req, res) => {
  const authProvider = req.body.authProvider;
  const providerToken = req.headers.authorization;
  const DataFromProviders = await verifyGoogleToken(providerToken);
  // console.log(DataFromProviders);
  const { email, name, picture } = DataFromProviders;

  const userData: IUser = {
    email: email,
    name: name,
    imgUrl: picture,
    password: `default_${email}`,
    role: 'reader',
    authProvider,
  };
  const user = await UserServices.registerNewUserIntoDB(userData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${user.user.role} is created successfully`,
    data: user,
  });
});

const AllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.findAllUsers(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: customizedMsg(result?.result, 'Users'),
    data: result,
  });
});

const updateAUserFun = catchAsync(async (req, res) => {
  const { email } = req.params;
  const data = JSON.parse(req.body.data);
  const imgUrl = req.file?.path;
  const payLoad = { ...data, imgUrl };
  const result = await UserServices.updateAUser(email, payLoad);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User updated successfull`,
    data: result,
  });
});

const deleteAUserFun = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserServices.deleteAUser(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User deleted successfully`,
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const { email } = req.user as { email: string };
  const result = await UserServices.getMyProfile(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile fetched successfully!',
    data: result,
  });
});

const getMyProfileByEmail = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await UserServices.getMyProfile(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile fetched successfully!',
    data: result,
  });
});

export const UserControllers = {
  registerUser,
  registerUserViaProvider,
  AllUsers,
  updateAUserFun,
  deleteAUserFun,
  getMyProfile,
  getMyProfileByEmail,
};
