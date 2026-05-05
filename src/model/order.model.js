import mongoose from "mongoose";
const { Schema } = mongoose;

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';


const orderSchema = new Schema({
    order_userId: {
        type: Number,
        require: true
    },
    order_checkout: {
        type: Object,
        default: {},
        require: true
    },
    /**
     *  order_checkout: {
     *    totalCheckout: Number,
     *    totalDiscount: Number,
     *    price: Number,
     *    feeShip: Number
     * }
     */
    order_shiping: {
        type: Object,
        default: {},
    },
    order_payment: {
        type: Object,
        default: {},
    },
    order_product: {
        type: Array,
        default: [],
        require: true
    },
    order_trackingNumber: {
        type: String,
        default: "",
    },
    order_status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending"
    }
})

export const orderModel = mongoose.model(DOCUMENT_NAME, orderSchema, COLLECTION_NAME)