import mongoose from 'mongoose';
import {countConect} from '../helpers/check.connect.js';
import config from '../configs/config.mongodb.js';
const connectString = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`

// bí thuật design partten Singgle Ton 
class Database {
    constructor() {
        this.connect();
    }
    async connect() {
        try{
            await mongoose.connect(connectString,{
                /* pool size là khái niệm về lượng kết nối tối đa 
                nếu lượng kết nối lớn hơn 50 thì bắt req phải chờ 
                cho đến khi có kết nối nào rảnh thì sẽ chèn vào 
                */
                maxPoolSize : 50
            })
            console.log(`Connected succes with database with ${config.db.name}`,countConect())
        }
        catch(err){
            console.error("Cannot connect db")
            
        }
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}
export default  Database

