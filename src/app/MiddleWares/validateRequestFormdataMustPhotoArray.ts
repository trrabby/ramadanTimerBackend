import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

const validateRequestFormdataMustPhotoArray = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const Data = JSON.parse(req.body.data);
    const imgUrl = Array.isArray(req.files) ? req.files : [];
    const ParsedData = { ...Data, imgUrl };
    // console.log(ParsedData);
    await schema.parseAsync({
      body: ParsedData,
      files: imgUrl,
      cookies: req.cookies,
    });

    next();
  });
};

export default validateRequestFormdataMustPhotoArray;
