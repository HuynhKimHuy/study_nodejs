import express from 'express'
import accessController from '../../controller/access.controller.js'
import { asyncHandler } from '../../auth/checkAuth.js'
const AccessRouter = express.Router()

AccessRouter.post('/shop/signup',asyncHandler(accessController.signUp))
export default AccessRouter