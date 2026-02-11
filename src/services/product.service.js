import { Product as ProductModel, Electronic as ElectronicModel, Clothing as ClothingModel } from '../model/product.js'
import { BadRequestError } from '../core/error.respone.js'
class ProductFactory {
    static async createProduct(type, payload = {}) {
        
        switch (type) {
            case "Electronics": return new Electronic(payload).createProduct()
            case "Clothing": return new Clothing(payload).createProduct()
            default:
                throw new BadRequestError(`Ivalid Product Types ${type}`)
        }
    }
}
//   product_name: { type: String, required: true },
//   product_thumb: { type: String, required: true },
//   product_description: String,
//   product_price: { type: Number, required: true },
//   product_quantity: { type: Number, required: true },
//   product_type: {
//             type: String,
//             required: true,
//             enum: ['Electronics', 'Clothing', 'Furniture']
//         },
//         product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
//         product_attributes: {
//             type: Schema.Types.Mixed,
//             required: true
// }
class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes
    } = {}) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    async createProduct(product_id) {
        const payload = {
            product_name: this.product_name,
            product_thumb: this.product_thumb,
            product_description: this.product_description,
            product_price: this.product_price,
            product_quantity: this.product_quantity,
            product_type: this.product_type,
            product_shop: this.product_shop,
            product_attributes: product_id ?? this.product_attributes
        }
        if (product_id) payload._id = product_id
        return await ProductModel.create(payload)
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await ClothingModel.create(this.product_attributes)
        if (!newClothing) throw new BadRequestError('create Clothings Error')
        const newPrduct = await super.createProduct(newClothing._id)
        return newPrduct
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await ElectronicModel.create(this.product_attributes)
        if (!newElectronic) throw new BadRequestError('create Electronic Error')

        const newPrduct = await super.createProduct(newElectronic._id)
        return newPrduct
    }
}

export default ProductFactory
