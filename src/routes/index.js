import { Router } from 'express'
import AccessRouter from './access/index.js'
import ShopRouter from './shop/index.js'
import ProductRouter from './product/index.js'
import DiscountRouter from './discount/index.js'
import CartRouter from './cart/index.js'
import CheckoutRouter from './checkout/index.js'
import CommentRouter from './comment/index.js'
import { apiKey, permissions } from '../auth/checkAuth.js'
import InventoryRouter from './inventory/index.js'
import pushToLogDiscord from '../middleware/index.js'
import NotiRouter from './notification/index.js'

const router = Router()

// Signup is public - no apiKey required
// router.use(pushToLogDiscord)
router.use('/v1/api/shop/signup', ShopRouter)

// All other routes require apiKey
router.use(apiKey)
router.use(permissions('0000'))
router.use('/v1/api/inventory', InventoryRouter)
router.use('/v1/api/checkout', CheckoutRouter)
router.use('/v1/api/cart', CartRouter)
router.use('/v1/api/discount', DiscountRouter)
router.use('/v1/api/product', ProductRouter)
router.use('/v1/api/comment', CommentRouter)
router.use('/v1/api/notification', NotiRouter)
router.use('/v1/api', AccessRouter)


export default router
