import express from 'express'
import accessController from '../../controller/access.controller.js'
import {asyncHandler} from '../../helpers/asyncHandler.js'
import { authentication } from '../../auth/authUntil.js'

const AccessRouter = express.Router()


AccessRouter.post('/shop/signup',asyncHandler(accessController.signUp))


AccessRouter.post('/shop/login',asyncHandler(accessController.login))
//authentication 

// Check header xem có mang theoi client ID và AccessToken không 
AccessRouter.use(authentication)

AccessRouter.post('/shop/logout', asyncHandler(accessController.logout))

AccessRouter.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken))
export default AccessRouter
