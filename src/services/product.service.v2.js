import { Product as ProductModel, Electronic as ElectronicModel, Clothing as ClothingModel, Furniture as FurnitureModel } from '../model/product.js'
import mongoose from 'mongoose'
import { BadRequestError } from '../core/error.respone.js'
import { findAllDraftsForShop, findAllProduct, findPublishedProducts, publicProductByShop, unPublicProductByShop, searchProductByUser, findProducts, updateProductById } from '../model/repositories/product.repo.js'
import { convertToObjectId, removeEmptyFields, updateNestedObjectParser } from '../untils/getShopdata.js'
import { insertInventory } from "../model/repositories/inventory.repo.js"
import NotifiService from './notifi.service.js'
import { findShopNameById } from '../model/repositories/shop.repo.js'
class ProductFactory {

    static productRegistry = {}

    static regisProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload = {}) {
        const productClass = ProductFactory.productRegistry[type]
        return new productClass(payload).createProduct()
    }

    static async updateProduct(type, product_id, payload) {
        const productClass = ProductFactory.productRegistry[type]
        return new productClass(payload).updateProduct(product_id)
    }

    // query
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })

    }

    static async findPublicProductByShop({ product_shop, product_id }) {
        const query = { product_shop, isPublished: true, isDraft: false }
        return await findPublishedProducts({ query, product_id })
    }

    static async searchProductByUser({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }

    static async findAllProduct({
        limit = 50,
        sort = "ctime",
        page = 1,
        filter = { isPublished: true },
        select = ['product_name', 'product_price', 'product_description', 'product_thumb']
    }) {
        return await findAllProduct({ limit, sort, page, filter, select })
    }

    static async findProducts({ product_id, }) {
        return await findProducts({ product_id, unSelect: ['__v'] })
    }

    //Put 
    static async putPublishedForShop({ product_shop, product_id }) {
        return await publicProductByShop({ product_shop, product_id })
    }

    static async unPutPublishedForShop({ product_shop, product_id }) {
        return await unPublicProductByShop({ product_shop, product_id })
    }

}

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
        const newProduct = await ProductModel.create({ ...this, _id: product_id })

        if (newProduct) {
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })
            console.log(this.product_shop);
            const shopName = await findShopNameById(convertToObjectId(this.product_shop))
            if (!shopName)
                throw new BadRequestError('ShopName not found')
            await NotifiService.postNotiToSystem({
                type: "ORDER-001",
                senderId: this.product_shop,
                receiverId: 1,
                content: `Sản phẩm ${this.product_name} đã được thêm vào  ${shopName} tạo `,
                options: {
                    shopId: this.product_shop,
                    shopName: shopName,
                    productName: this.product_name
                }
            }).then(() => {
                console.log('Notification sent successfully');
            }).catch((error) => {
                console.error('Error sending notification:', error);
            });
        }


        return newProduct
    }
    async updateProduct(product_id, updateBody) {
        return await updateProductById({
            product_id,
            updateBody,
            model: ProductModel
        })
    }

}

class Clothing extends Product {
    async createProduct() {
        const productId = new mongoose.Types.ObjectId()
        const newClothing = await ClothingModel.create({
            ...this.product_attributes,
            product_id: productId,
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BadRequestError('create Clothings Error')
        const newProduct = await super.createProduct(productId)
        return newProduct
    }

    async updateProduct(product_id) {
        const objParams = this
        if (objParams.product_attributes) {
            await updateProductById({
                product_id,
                updateBody: {
                    ...objParams.product_attributes
                },
                model: ClothingModel
            })
        }
        const newProduct = await super.updateProduct(product_id, objParams)
        return newProduct
    }

}

class Furniture extends Product {
    async createProduct() {
        const productId = new mongoose.Types.ObjectId()
        const newFurniture = await FurnitureModel.create({
            ...this.product_attributes,
            product_id: productId,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('create Furniture Error')

        const newProduct = await super.createProduct(productId)
        return newProduct
    }

    async updateProduct(product_id) {
        const objParams = this
        if (objParams.product_attributes) {
            await updateProductById({
                product_id,
                updateBody: {
                    ...objParams.product_attributes
                },
                model: FurnitureModel
            })
        }
        const newProduct = await super.updateProduct(product_id, objParams)
        return newProduct
    }
}

class Electronic extends Product {
    async createProduct() {
        const productId = new mongoose.Types.ObjectId()

        const newElectronic = await ElectronicModel.create({
            ...this.product_attributes,
            product_id: productId,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError
            ('create Electronic Error')
        const newProduct = await super.createProduct(productId)
        return newProduct
    }

    async updateProduct(product_id) {
        const objParams = removeEmptyFields(this)
        if (objParams.product_attributes) {
            await updateProductById({
                product_id,
                updateBody: updateNestedObjectParser(objParams.product_attributes),
                model: ElectronicModel
            })
        }
        const newProduct = await super.updateProduct(product_id, updateNestedObjectParser(objParams))
        return newProduct

    }
}

ProductFactory.regisProductType('Electronic', Electronic)
ProductFactory.regisProductType('Furniture', Furniture)
ProductFactory.regisProductType('Clothing', Clothing)
export default ProductFactory
