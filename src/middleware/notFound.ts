import { Request, Response } from "express";
import app from "../app";

export const notFoundRoute = (req: Request, res: Response) => {
  res.status(404).json({
    message: "Route not Found",
    path: req.originalUrl,
    date: Date(),
  });
};
