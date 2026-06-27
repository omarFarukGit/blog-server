import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface";

import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

const logingUser = async (payload: ILoginUser) => {
  const { email, password } = payload;
  // const user=await prisma.user.findUnique({
  //     where:{email}
  // })
  // if(!user){
  //     throw new Error('user not found')
  // }

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  if (user.activeStatus === "BLOCKED") {
    throw new Error("your account has been bloked. please contact support");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  // const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret, {
  //   expiresIn: config.jwt_access_exprire_in,
  // } as SignOptions);

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_exprire_in as SignOptions,
  );

  // const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_exprire_in, {
  //   expiresIn: config.jwt_refresh_exprire_in,
  // } as SignOptions);

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_exprire_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
  // return user;
};

const refreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = jwtUtils.verifiedToken(
    refreshToken,
    config.jwt_refresh_secret,
  );
  if(!verifiedRefreshToken.success){
    throw Error(verifiedRefreshToken.error)
  }
  const {id}=verifiedRefreshToken.data as JwtPayload;
  
  const user=await prisma.user.findUniqueOrThrow({where:{id}})

  if(user.activeStatus==="BLOCKED"){
    throw new Error("user is blocked")
  }
  const jwtPayload={
    id,
    name:user.name,
    email:user.email,
    role:user.role
  }
  const accessToken=jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_exprire_in as SignOptions
  )

  return {accessToken}
};

export const authService = {
  logingUser,
  refreshToken,
};
