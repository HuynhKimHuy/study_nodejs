// lấy schema của shop
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import shopModel from '../model/schema.js'
import KeytokenService from './keyToken.service.js'
import { createTokenPair } from '../auth/authUntil.js'
import getDataShop from '../untils/getShopdata.js'
const roles = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

/**
 * Hàm access có 1 hàm static nhận vào 3 tham số ({name , email , password}) , Email là bắc buột  check điều kiện 
 * step 1 : check email exists 
 * step 2 : const hash mật khẩu bằng Bcryt.hash( nhận vào mật khẩu và muối )
 * step 3 : model shop tạo shop , nhận vào mật khẩu là password được hash 
 * step 4 : tạo publicKey , privated bằng crypto.generateKeyPairSync( 'tên thuật toán', { modulelength : 4096})
 * step 5 : 
 */
class AccessService {
    // nhận vào tên shop mật khẩu và email 
    static SignUp = async ({ name, email, password }) => {
        a
        if (!email) {
            // nếu email không có báo lõi 
            return {
                code: '400',
                message: 'email exits',
                status: 'BAD REQUEST'
            }
        }
        // dùng findOne check mail xem đã tồn tại chưa 
        // try {
            // step1: check email exists??
            const shop = await shopModel.findOne({ email }).lean()
            // nếu có báo lõi 
            if (shop) {
                return {
                    code: 'xxx',
                    message: "shop already registered"
                }
            }

            // dùng bcrypt hash mật khẩu 
            const hashPassword = await bcrypt.hash(password, 10)
            // create NewShop
            const newShop = await shopModel.create({
                name: name || "Kim Huy",
                email: email || "huy@email.com",
                password: hashPassword || password,
                roles: [roles.SHOP]

            })

            if (!newShop) {
                throw new Error('Failed to create shop');
            }

            // phước tạp dành cho hệ thống lớn bla bla 
            //created privaKey and publicKey
            // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            //     modulusLength : 4096,
            //     publicKeyEncoding:{
            //         type:'pkcs1',
            //         format:'pem'
            //     },
            //     privateKeyEncoding:{
            //         type:'pkcs1',
            //         format:'pem'
            //     }

            // })

            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')
            console.log(privateKey, publicKey); //save colection keystore

            // bắt đầu tạo và lưu vào model 
            const keyShop = await KeytokenService.createToken({
                userID: newShop._id,
                publicKey: publicKey,
                privateKey: privateKey
            })

            if (!keyShop) {
                return {
                    code: '201',
                    message: "keyShop errorr"
                }
            }
            
            console.log(`keyShop::`, keyShop)

            const tokens = await createTokenPair({ payload: newShop._id, email }, publicKey, privateKey)

            if (tokens) {
                console.log(`Created token success :: ${tokens}`);
            }

            return {
                code: 200,
                metadata: {
                    shop: getDataShop({ fileds: ['_id', 'name', 'email'], object: newShop }),
                    tokens
                }
            }
        // }
        // catch (error) {
        //     console.log(error);

        //     return {
        //         code: 'xxxx',
        //         message: error.message,
        //         status: 'error'
        //     }
        // }
    }
}

export default AccessService
