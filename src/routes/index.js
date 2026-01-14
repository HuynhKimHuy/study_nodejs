import express, { Router } from 'express';
import AccessRouter from './access/index.js';
import {apiKey,permissions} from '../auth/checkAuth.js';

const router = express.Router()

router.use(apiKey)
router.use(permissions(`0000`))

router.use('/v1/api',AccessRouter)

export default router