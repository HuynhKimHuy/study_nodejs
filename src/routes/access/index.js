import express from 'express'
import accessController from '../../controller/access.controller.js'
const AccessRouter = express.Router()

AccessRouter.post('/shop/signup',accessController.signUp)
export default AccessRouter