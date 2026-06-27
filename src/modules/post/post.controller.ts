import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendREsponse } from "../../utils/sendResponse";

const createPost = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const payload = req.body;

  const result = await postService.createPost(payload, id as string);

  sendREsponse(res, {
    success: true,
    statusCode: 201,
    message: "post created successfully",
    data: result,
  });
});

const getAllPosts = catchAsync(async (req: Request, res: Response) => {
  const result = await postService.getAllPosts();

  sendREsponse(res, {
    success: true,
    statusCode: 201,
    message: "post created successfully",
    data: result,
  });
});

const getPostById = catchAsync(async (req: Request, res: Response) => {});

const updatePost = catchAsync(async (req: Request, res: Response) => {});

const deletePost = catchAsync(async (req: Request, res: Response) => {});

const getPostsStats = catchAsync(async (req: Request, res: Response) => {});

const getMyPosts = catchAsync(async (req: Request, res: Response) => {});

export const postController = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsStats,
  getMyPosts,
};
