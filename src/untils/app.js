
import express, { urlencoded } from 'express';
// morgan là thư viện ghi log khi có các request từ HTTP đến sever
import morgan from 'morgan';
import helmet from "helmet";
import compression from 'compression';
import { countConect, checkOverLoad } from "../helpers/check.connect.js";
import dotenv from 'dotenv';
import router from '../routes/index.js';
// mongoose.set('debug', true)
import Database from '../dbs/init.mongodb.js'

dotenv.config()

Database.getInstance()
const app = express();


// init middle ware
app.use(morgan("dev")); // 'dev' là kiểu log phổ biến khi dev
app.use(helmet()) // chặn xem curl "link" include
app.use(express.json()); //này quá quen thuộc
app.use(urlencoded({
    extended:true,
}))
app.use(compression())

// countConect();
// checkOverLoad();
app.use('/',router)


app.use((req,res,next)=>{
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req,res,next)=>{
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status:'error',
        code: statusCode,
        message:error.message ||"Internal sever Error"
    })
})

export default app