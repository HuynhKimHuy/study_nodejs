// lấy schema của shop
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import shopModel from '../model/schema.js'
import KeytokenService from './keyToken.service.js'
import { createTokenPair } from '../auth/authUntil.js'
import getDataShop from '../untils/getShopdata.js'
import { BadRequestError, AuthFailureError } from '../core/error.respone.js'
import findByEmail from './shop.service.js'
const roles = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static login = async ({email , password, refreshToken = null})=>{
        
        
        // step 1 : check sevice.js 
        const foundShop = await findByEmail({email})
        
        if(!foundShop){
           throw new BadRequestError("Cannot Find Shop")
        }
        
        const mathPass = await bcrypt.compare(password, foundShop.password)

        if(!mathPass){
             throw new AuthFailureError("Invalid password")
        }

        // step 2 
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        // step 3 
        const tokens = await createTokenPair({ userID: foundShop._id, email: foundShop.email }, publicKey, privateKey)
        if(!tokens.refreshToken){
            throw new BadRequestError("khong co request token")
        }
        await KeytokenService.createToken({userID:foundShop._id, publicKey:publicKey, privateKey:privateKey, refreshToken:tokens.refreshToken })
        
        return {
            shop:getDataShop({ fields: ['_id', 'name','email'],object:foundShop}),
            tokens
        }
    }

    static SignUp = async ({ name, email, password }) => {
             const shop = await shopModel.findOne({ email }).lean()
            if (shop) {
                 throw new  BadRequestError("Error: Shop already registered ")
            }

            const hashPassword = await bcrypt.hash(password, 10)
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
            
          
            const keyShop = await KeytokenService.createToken({
                userID: newShop._id,
                privateKey: privateKey,
                publicKey: publicKey
            })

            if (!keyShop) {
               throw new BadRequestError("Key store Error")
            }
            
            console.log(`keyShop::`, keyShop)

            const tokens = await createTokenPair({ userID: newShop._id, email }, publicKey, privateKey)

            
            if (tokens) {
                console.log(`Created token success :: ${tokens}`);
            }

            return {
                code: 200,
                metadata: {
                    shop: getDataShop({ fields: ['_id', 'name', 'email'], object: newShop }),
                    tokens
                }
            }
    }

    static logout = async (keyStore)=>{
        return await KeytokenService.removeKeyByID(keyStore._id)
    }
}

export default AccessService
