import express from 'express';
import commentController from '../../controller/comment.controller.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
const CommentRouter = express.Router()

CommentRouter.post('', asyncHandler(commentController.createComment))
CommentRouter.get('', asyncHandler(commentController.GetCommentsByParentID))
CommentRouter.delete('', asyncHandler(commentController.DelectsComment))
export default CommentRouter