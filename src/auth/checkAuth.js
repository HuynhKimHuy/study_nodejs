/**
 * Tạo hàm apiKey là 1 hàm middle ware nên là hàm aync 
 * step 1 : kiểm tra header, xem header của người dùng gửi lên có trùng với mặc định của HEADER.APIKEY hay khong, nếu không => báo lõi 403 Forbidden Error
 *   req.header[HEADER.API_KEY].toString()
 *     return res.json({
 *      code   : "403"
 *      message: "Forbiden Error"
 * })
 * step 2 : lấy từ service APi key check xem có trong db không ( có 1 thiếu sót là schema api key phải liên quan tới người dùng , hiện tại thầy chưa tạo ) 
 */

import { BadRequestError } from "../core/error.respone.js"
import findByID from "../services/apiKey.service.js"

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

export const apiKey = async (req, res, next) => {
        
        const key = req.headers[HEADER.API_KEY]?.toString()
    
        if(!key){
            throw new BadRequestError("Forbiden Error form Header")
        }
        console.log(key);
        
        const objKeys = await findByID(key)

        if (!objKeys) {
            throw new BadRequestError("Cannot find OBJ key in db ")
        }
        
        req.objKey = objKeys
        return next()
  
}

export const permissions =(permission)=>{
    return (req,res,next)=>{
    
        if(!req.objKey.permissions){
            return res.status(403).json({
                message: "permisssion dinied"
            })
        }

        console.log('permissions::',req.objKey.permissions);
        const validPermissons = req.objKey.permissions.includes(permission)
         if(!validPermissons){
             return res.status(403).json({
                message: "permisssion dinied"
            })
         }

         return next()
    }
    
}



/**
 * lấy header[HEAER.API_KEY], đưa vào hàm findByid tự tạo , dùng findOne lấy ra obj của schema đó , xong gán vào req, 
 * 
 * 
 */