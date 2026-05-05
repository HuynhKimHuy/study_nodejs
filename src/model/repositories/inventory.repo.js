import { convertToObjectId } from "../../untils/getShopdata.js"
import { InventoryModel } from "../inventory.model.js"

export const insertInventory = async ({ productId, shopId, stock, location = "unknow" }) => {
    return await InventoryModel.create({
        inven_product_id: productId,
        inven_shop: shopId,
        stock: stock,
        inven_stock: stock,
        inven_location: location
    })
}

export const reversationInventory = async ({ productId, cartId, quantity }) => {
    const query = {
        inven_product_id: convertToObjectId(productId),
        inven_stock: { $gte: quantity }
    }
    const dataSet = {
        $inc: { inven_stock: -quantity },
        $push: {
            inventory_reservations: {
                cartId,
                quantity,
                reservedAt: new Date()
            }
        }
    }
    const options = {
        upsert: true,
        new: true
    }
    return await InventoryModel.updateOne(query, dataSet, options)
}