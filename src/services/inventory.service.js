
import { InventoryModel } from "../model/inventory.model.js";
import { getProductById } from "../model/repositories/product.repo.js";
import { convertToObjectId } from "../untils/getShopdata.js";

class InventoryService {

    static async addStockInventory({ productId, shopId, stock, location = " 134 ddiaj chi " }) {

        const product = await getProductById({ productId })
        if (!product) throw new Error("Product not found")

        const query = {
            inven_product_id: convertToObjectId(productId),
            inven_shop: convertToObjectId(shopId)
        }
        const dataSet = {
            $inc: { stock: stock, inven_stock: stock },
            $set: { inven_location: location }
        }

        const options = {
            upsert: true,
            new: true
        }
        return await InventoryModel.findOneAndUpdate(query, dataSet, options)
    }
}
export default InventoryService