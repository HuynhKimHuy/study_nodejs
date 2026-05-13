import mongoose, { now } from "mongoose";
const Schema = mongoose.Schema;

const DOCUMENT__NAME = "Notification";
const COLLECTION_NAME = "notifications";
//ORDER-001: Đơn hàng đã được tạo thành công
//ORDER-002: Đơn hàng đã được giao thành công
//ORDER-003: Đơn hàng đã bị hủy
//PROMOTION-001: Khuyến mãi mới đã được áp dụng
//PROMOTION-002: Khuyến mãi sắp hết hạn
//PRODUCT-001: Sản phẩm mới đã được thêm vào
const notificationSchema = new Schema({
    noti_types: {
        type: String,
        enum: ['ORDER-001', 'ORDER-002', 'ORDER_003', 'PROMO-001', 'PROMO-002', 'PROMO-003']
    },
    noti_senderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    noti_receiverId: {
        type: Number,
        required: true,
    },
    noti_content: {
        type: String,
        required: true
    },
    noti_isRead: {
        type: Boolean,
        default: false
    },
    noti_options: {
        type: Object,
        default: {}
    },
},
    {
        timestamps: true,
        collection: COLLECTION_NAME

    })


const NotificationModel = mongoose.model(DOCUMENT__NAME, notificationSchema);

export default NotificationModel;
