import express from 'express';
import AccessRouter from './access/index.js';

const router = express.Router()

router.use('/v1/api',AccessRouter)
router.get("/",(req,res,next)=>{
     return res.status(200).json(
        {message:'Hello World! Anh Huy chào các em!'
        });
})

export default router