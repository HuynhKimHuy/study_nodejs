import { Router } from 'express'
import accessController from '../../controller/access.controller.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { authentication } from '../../auth/authUntil.js'

const AccessRouter = Router()

AccessRouter.post('/shop/login', asyncHandler(accessController.login))
AccessRouter.use(authentication)
AccessRouter.post('/shop/logout', asyncHandler(accessController.logout))
AccessRouter.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken))

export default AccessRouter
