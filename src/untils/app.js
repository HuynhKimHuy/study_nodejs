
import express, { urlencoded } from 'express';
// morgan là thư viện ghi log khi có các request từ HTTP đến sever
import morgan from 'morgan';
import helmet from "helmet";
import compression from 'compression';
import cors from 'cors';
import { countConect, checkOverLoad } from "../helpers/check.connect.js";
import dotenv from 'dotenv';
import router from '../routes/index.js';
// mongoose.set('debug', true)
import Database from '../dbs/init.mongodb.js'
import Redis from '../dbs/init.redis.js'
import cookieParser from 'cookie-parser'
import ProductServiceTest from '../test/product.test.js'


dotenv.config()

Database.getInstance()
Redis.getInstance()
// ProductServiceTest.purschaseProduct({ productId: 'product:001', quantity: 2 }).catch(err => console.error('[Test] Error:', err))
const app = express();
app.use(cookieParser())

// init middle ware
app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
        allowedHeaders: [
            "Content-Type",
            "x-api-key",
            "x-client-id",
            "authorization",
            "refreshtoken",
        ],
    })
);
app.use(morgan("dev")); // 'dev' là kiểu log phổ biến khi dev
app.use(helmet()) // chặn xem curl "link" include
app.use(express.json()); //này quá quen thuộc
app.use(urlencoded({
    extended: true,
}))
app.use(compression())

// countConect();
// checkOverLoad();
app.use('/', router)


app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || "Internal sever Error"
    })
})

export default app