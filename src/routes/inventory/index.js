import express from 'express'
import inventoryController from '../../controller/inventory.controller.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { authentication } from '../../auth/authUntil.js'

const InventoryRouter = express.Router()

InventoryRouter.use(authentication)

InventoryRouter.post('', asyncHandler(inventoryController.addStockInventory))

export default InventoryRouter
