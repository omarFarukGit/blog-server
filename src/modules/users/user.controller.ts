import express, { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendREsponse } from "../../utils/sendResponse";
import Jwt from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

// const createUser = async (req: Request, res: Response) => {
//   try {
//     const payload = req.body;

//     const user = await userService.registerUserIntoDB(payload);

//     res.status(httpStatus.CREATED).json({
//       sucess: true,
//       statusCode: httpStatus.CREATED,
//       message: "User registred successfully",
//       data: user,
//     });
//   } catch (error: any) {
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       sucess: false,
//       statusCode: httpStatus.INTERNAL_SERVER_ERROR,
//       message: "Faild to register user",
//       error: error.message,
//     });
//   }
// };

const createUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const user = await userService.registerUserIntoDB(payload);

  // res.status(httpStatus.CREATED).json({
  //   sucess: true,
  //   statusCode: httpStatus.CREATED,
  //   message: "User registred successfully",
  //   data: user,
  // });

  sendREsponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "user created succesfully",
    data: { user },
  });
});

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const { accessToken } = req.cookies;

    // console.log(req.user,'user')
    // // // const verifiedToken = Jwt.verify(accessToken, config.jwt_access_secret);

    // const verifiedToken = jwtUtils.verifiedToken(
    //   accessToken,
    //   config.jwt_access_secret,
    // );

    // if (typeof verifiedToken === "string") {
    //   throw new Error(verifiedToken);
    // }

    const profile = await userService.getMyProfileFromDB(req.user?.id as string);
    // console.log(verifiedToken);

    sendREsponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "user profile fatche sucessfully",
      data: { profile },
    });
  },
);

export const userController = {
  createUser,
  getMyProfile,
};
