import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
const app: Application = express();
import cors from "cors";

import config from "./config";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);


app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

export default app;
