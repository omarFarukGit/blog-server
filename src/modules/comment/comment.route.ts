import { Router } from "express";
import { auth } from "../../middleware/auth";
import { commentController } from "./comment.controller";

const router=Router();

router.post('/',auth(),commentController.createComment)

router.get('/author/:authorId',commentController.getCommentByAuthorId)

router.get("/:commentId",commentController.getCommentByAuthorId)


router.patch('/:commentId',auth(), commentController.updateComment)

router.delete("/:commentId",auth(), commentController.deleteComment)

router.patch('/:commentId/modarate',commentController.moderateComment)


export const commentRoutes=router