import { Created } from "../core/success.response.js"
import ProductFactory from "../services/product.service.js"

class ProductController {
    createProduct = async (req, res, next) => {
      
        new Created({
            message: 'Create product success',
            statusCode: 201,
            metadata: await ProductFactory.createProduct(req.body.product_type,
               {
                ...req.body,
                product_shop: req.user.userID
               }
            )
        }).send(res)
    }

}


export default new ProductController()
