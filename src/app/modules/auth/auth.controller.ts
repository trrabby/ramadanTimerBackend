import httpStatus from 'http-status';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import {
  verifyGithubToken,
  verifyGoogleToken,
} from '../../utils/ProvidersTokenVerify';
import AppError from '../../errorHandlers/AppError';
import { IdecodedUser } from '../users/user.controller';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  // console.log(result);
  const { refreshToken, accessToken, needsPasswordChange } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in succesfully!',
    data: {
      accessToken,
      refreshToken,
      needsPasswordChange,
    },
  });
});

const loginUserViaGoogle = catchAsync(async (req, res) => {
  const providerToken = req.headers.authorization;
  const DataFromProviders = await verifyGoogleToken(providerToken as string);
  // console.log(DataFromProviders);
  const { email, verifiedEmail } = DataFromProviders as IdecodedUser;
  if (!verifiedEmail) {
    new AppError(httpStatus.UNAUTHORIZED, 'User not verified!!');
  }
  const result = await AuthServices.loginViaProvider(email);
  // console.log(result);
  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in succesfully!',
    data: {
      accessToken,
      refreshToken,
    },
  });
});

const loginUserViaGithub = catchAsync(async (req, res) => {
  const providerToken = req.headers.authorization;
  const DataFromProviders = await verifyGithubToken(providerToken as string);
  // console.log(DataFromProviders);
  const { email } = DataFromProviders as IdecodedUser;

  const result = await AuthServices.loginViaProvider(email);
  // console.log(result);
  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in succesfully!',
    data: {
      accessToken,
      refreshToken,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await AuthServices.changePassword(req.user, passwordData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is updated succesfully!',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  let { refreshToken } = req.cookies;
  if (!refreshToken) {
    refreshToken = req.headers.authorization;
  }
  let token;
  if (refreshToken) {
    token = refreshToken.split(' ')[1];
  }
  const result = await AuthServices.refreshToken(token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved succesfully!',
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  // console.log(req.body.email);
  const result = await AuthServices.forgetPassword(req.body.email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reset link is generated succesfully!',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  let token = req.headers.authorization;
  if (!token) {
    token = req.body.token;
  }
  const result = await AuthServices.resetPassword(req.body, token as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset succesful!',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  loginUserViaGoogle,
  loginUserViaGithub,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
