import express from 'express'
import accessController from '../../controller/access.controller.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'

const ShopRouter = express.Router()

// Shop registration
ShopRouter.post('', asyncHandler(accessController.signUp))

export default ShopRouter
