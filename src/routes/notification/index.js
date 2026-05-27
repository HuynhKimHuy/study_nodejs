import express from 'express';
import { apiKey, permissions } from '../../auth/checkAuth.js';
import NotiController from '../../controller/noti.controller.js';
import { asyncHandler } from '../../helpers/asyncHandler.js';
const NotiRouter = express.Router();

// Apply middleware to all routes in this router
NotiRouter.use(apiKey);
NotiRouter.use(permissions('0000'));

NotiRouter.get("", asyncHandler(NotiController.ListNotiByUserId))

export default NotiRouter;

