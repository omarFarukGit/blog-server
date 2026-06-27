import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
const app: Application = express();
import cors from "cors";
import httpStatus from "http-status";

import config from "./config";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { UserRoutes } from "./modules/users/user.route";
import { authRoutes } from "./modules/auth/auth.routes";
import { postRoutes } from "./modules/post/post.route";
import { commentRoutes } from "./modules/comment/comment.route";

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

app.use("/api/users", UserRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

export default app;
