import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { postController } from "./post.controller";

const router = Router();

router.post('/',auth(Role.ADMIN,Role.USER),postController.createPost)

router.get('/',auth(),postController.getAllPosts)

router.get('/stats',auth(),postController.getPostsStats)

router.get('/my-posts',auth(),postController.getMyPosts)

router.get('/:postId',postController.getPostById)

router.patch("/:postId",auth(),postController.deletePost)

router.delete('/:postId',auth(),postController.deletePost)

export const postRoutes = router;
