import { Created } from "../core/success.response.js"
import InventoryService from "../services/inventory.service.js"

class InventoryController {
    addStockInventory = async (req, res, next) => {
        new Created({
            message: 'Add stock inventory success',
            statusCode: 201,
            metadata: await InventoryService.addStockInventory({
                ...req.body,
                shopId: req.user.userID
            })
        }).send(res)
    }
}

export default new InventoryController()