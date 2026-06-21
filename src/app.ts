import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
const app: Application = express();
import cors from "cors";
import httpStatus from "http-status";

import config from "./config";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

//test api
app.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.send(users);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/api/users/register", async (req: Request, res: Response) => {
  const { name, email, password, profilePhoto } = req.body;

  const isUserExit = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExit) {
    throw new Error("User allready exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const crearedUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  //create user profile
  await prisma.profile.create({
    data: {
      userId: crearedUser.id,
      profilePhoto,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: crearedUser.id,
      email: crearedUser.email || email,
    },
    omit: {
      password,
    },
    include: {
      profile: true,
    },
  });

  res.status(httpStatus.CREATED).json({
    sucess: true,
    statusCode: httpStatus.CREATED,
    message: "User registred successfully",
    data: user,
  });
});

export default app;
