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

import findByID from "../services/apiKey.service.js"

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

export const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key) {
            return res.status(403).json({
                message: "Forbiden Error from Header",
            })
        }
        console.log(key);
        const objKeys = await findByID(key)

        if (!objKeys) {
            return res.status(403).json({
                message: "Forbiden Error:: Cannot find Obj Key"
            })
        }
        req.objKey = objKeys
        return next()
    } catch (error) {
        console.error("[apiKey middleware] error", error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const permissions =(permission)=>{
    return (req,res,next)=>{
        console.log();

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

export const asyncHandler =fn=>{
    return(req,res,next)=>{
        fn(req,res,next).catch(next)
    }
}

/**
 * lấy header[HEAER.API_KEY], đưa vào hàm findByid tự tạo , dùng findOne lấy ra obj của schema đó , xong gán vào req, 
 * 
 * 
 */