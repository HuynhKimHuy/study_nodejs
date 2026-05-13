import mongoose, { Schema } from 'mongoose';

const DOCUMENT_NAME = 'Comment'
const COLLECTION_NAME = 'comments'

const CommentSchema = new Schema({
    comment_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    comment_userId: { type: Number, default: 0 },
    comment_content: { type: String, default: 'Text' },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parentId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

const CommentModel = mongoose.model(DOCUMENT_NAME, CommentSchema)

export default CommentModel