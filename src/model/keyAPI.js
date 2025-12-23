// Tạo 1 model key Api có 
/**
 * Key dạng chuỗi, không được trùng
 * trạng thái là boolean , mặc định là true 
 * permissions là quyền truy cập dạng chuỗi , bắc buộc phải  và enum['000','111','222']
 */

import mongoose, { Schema } from "mongoose";


const DOCUMENT_NAME = 'ApiKey'
const COLLECTION_NAME = 'ApiKeys'
// const model, schema , types... require mongooose

const apiKeySchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },

    status: {
        type: Boolean,
        default: true
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['0000', '1111', '2222']
    }
},
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
)

const apiKeyModel = mongoose.model(DOCUMENT_NAME,apiKeySchema)

export default apiKeyModel