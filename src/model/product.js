import mongoose from 'mongoose'

const { model, Schema } = mongoose

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema(
    {
        product_name: { type: String, required: true },
        product_thumb: { type: String, required: true },
        product_description: String,
        product_price: { type: Number, required: true },
        product_quantity: { type: Number, required: true },
        product_type: {
            type: String,
            required: true,
            enum: ['Electronics', 'Clothing', 'Furniture']
        },
        product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
        product_attributes: {
            type: Schema.Types.Mixed,
            required: true
        }
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true
    }
)

const electronicSchema = new Schema(
    {
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
        manufacturer: { type: String, required: true },
        size: String,
        color: String
    },
    {
        collection: 'electronics',
        timestamps: true
    }
)

const clothingSchema = new Schema(
    {
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
        brand: { type: String, required: true },
        size: String,
        material: String
    },
    {
        collection: 'clothes',
        timestamps: true
    }
)

export const Product = model(DOCUMENT_NAME, productSchema)

export const Electronic = model('Electronic', electronicSchema)

export const Clothing = model('Clothing', clothingSchema)


