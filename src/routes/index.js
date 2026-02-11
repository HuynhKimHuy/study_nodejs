import { Router } from 'express'
import AccessRouter from './access/index.js'
import ShopRouter from './shop/index.js'
import ProductRouter from './product/index.js'
import { apiKey, permissions } from '../auth/checkAuth.js'

const router = Router()

router.use(apiKey)
router.use(permissions('0000'))

router.use('/v1/api', AccessRouter)
router.use('/v1/api/shop/signup', ShopRouter)
router.use('/v1/api/product', ProductRouter)

export default router
