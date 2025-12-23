import express, { Router } from 'express';
import AccessRouter from './access/index.js';
import {apiKey,permissions} from '../auth/checkAuth.js';

const router = express.Router()
// check api user
router.use(apiKey)

// check quyền user
router.use(permissions(`0000`))
router.use('/v1/api',AccessRouter)
// router.get("/",(req,res,next)=>{
//      return res.status(200).json(
//         {message:'Hello World! Anh Huy chào các em!'
//         });
// })

export default router