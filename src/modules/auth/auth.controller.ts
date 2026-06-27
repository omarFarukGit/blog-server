import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendREsponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const logingUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const { accessToken, refreshToken } = await authService.logingUser(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, //24 hour one day
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    sendREsponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "user looged in successfully",
      data: { accessToken, refreshToken },
    });
  },
);

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  const result = authService.refreshToken(refreshToken);
    res.cookie("accessToken", (await result).accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, //24 hour one day
    });
  sendREsponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "token Refreshed successfully",
    data: { result },
  });
});

export const authController = {
  logingUser,
  refreshToken,
};
