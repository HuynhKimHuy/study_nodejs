
import CommentModel from "../model/comment.model.js";
import { findProducts } from "../model/repositories/product.repo.js";
import { convertToObjectId } from "../untils/getShopdata.js";
/*
 Key features:
    + add comment
    +get a list of comments of a product
    + delete comment ( SHOP || addin)
*/
class CommentService {
    static async CreateComment({ productId, userId, content, parentCommentId = null }) {
        const newComment = new CommentModel({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        });

        let rightValue
        if (parentCommentId) {
            //reply comment
            const commentParent = await CommentModel.findById(convertToObjectId(parentCommentId))

            if (!commentParent) {
                throw new Error('Parent comment not found')
            }

            rightValue = commentParent.comment_right

            //update right value of comment parent and its ancestors
            await CommentModel.updateMany(
                {
                    comment_productId: convertToObjectId(productId),
                    comment_right: { $gte: rightValue }
                },
                { $inc: { comment_right: 2 } }
            )
            //update left value of comment parent and its ancestors
            await CommentModel.updateMany(
                {
                    comment_productId: convertToObjectId(productId),
                    comment_left: { $gt: rightValue }
                },
                { $inc: { comment_left: 2 } }
            )


        } else {
            const maxRightValue = await CommentModel.findOne({
                comment_productId: convertToObjectId(productId),
            }, 'comment_right', {
                sort: { comment_right: -1 }
            }
            )
            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1
            } else {
                rightValue = 1
            }

        }
        //Insert Comment
        newComment.comment_left = rightValue
        newComment.comment_right = rightValue + 1

        await newComment.save()
        return newComment
    }

    static async GetCommentsByParentID({ productId, parentCommentId = null, limit = 10, offset = 0 }) {
        let query = { comment_productId: convertToObjectId(productId) };

        if (parentCommentId) {
            const parentComment = await CommentModel.findById(convertToObjectId(parentCommentId))
            if (!parentComment) {
                throw new Error('Parent comment not found')
            }
            // Lấy toàn bộ descendants: left > parent.left AND right < parent.right
            query = {
                comment_productId: convertToObjectId(productId),
                comment_left: { $gt: parentComment.comment_left },
                comment_right: { $lt: parentComment.comment_right }
            };
        }

        const comments = await CommentModel.find(query)
            .select({
                comment_content: 1,
                comment_parentId: 1,
                comment_left: 1,
                comment_right: 1
            })
            .sort({ comment_left: 1 })
            .limit(limit)
            .skip(offset)

        return comments
    }

    static async DeleteComment({ commentId, productId }) {
        //checkProduct in db 
        const foundProduct = await findProducts({ product_id: convertToObjectId(productId), unSelect: [] })
        if (!foundProduct) throw new Error('Product not found')

        const comment = await CommentModel.findById(convertToObjectId(commentId))
        if (!comment) throw new Error('Comment not found')

        const left = comment.comment_left
        const right = comment.comment_right
        const width = right - left + 1

        //delete comment and its descendants
        await CommentModel.deleteMany({
            comment_productId: convertToObjectId(productId),
            comment_left: { $gte: left },
            comment_right: { $lte: right }
        })

        //update left and right value of remaining comments
        await CommentModel.updateMany(
            {
                comment_productId: convertToObjectId(productId),
                comment_left: { $gt: right }
            },
            { $inc: { comment_left: -width } }
        )

        await CommentModel.updateMany(
            {
                comment_productId: convertToObjectId(productId),
                comment_right: { $gt: right }
            },
            { $inc: { comment_right: -width } }
        )


        return true
    }
}


export default CommentService