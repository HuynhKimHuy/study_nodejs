import CommentService from "../services/comment.service.js";
import ProductFactory from "../services/product.service.v2.js";
import { Created, OK } from "../core/success.response.js";
import DiscountService from "../services/discount.service.js";


class CommentController {

    createComment = async (req, res) => {
        new Created({
            message: "Create comment successfully",
            metadata: await CommentService.CreateComment({
                ...req.body,
            })
        }).send(res)
    }

    GetCommentsByParentID = async (req, res) => {
        new OK({
            message: "Get comment successfully",
            metadata: await CommentService.GetCommentsByParentID({
                ...req.query,
            })
        }).send(res)
    }

    DelectsComment = async (req, res) => {
        new OK({
            message: "Delete comment successfully",
            metadata: await CommentService.DeleteComment({
                ...req.body,
            })
        }).send(res)
    }
}
export default new CommentController()

