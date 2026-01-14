// Create Token 

import keyTokenModal from "../model/keytoken.model.js";
import { BadRequestError } from "../core/error.respone.js";
import {Types} from 'mongoose'

// hàn nhận vào 2 tham số : userID và publickey
class KeyTokenSevice{
    static createToken = async ({userID, publicKey,privateKey,refreshToken})=>{
            // const newKeyToken = await keyTokenModal.create({
            //     user:userID,
            //     publicKey:publicKey,
            //     privateKey:privateKey
            // })
            // return newKeyToken ? newKeyToken.publicKey : null
            const update = {user: userID, publicKey, privateKey, refreshTokensUsed : [], refreshToken}
            const option  = {upsert : true, new:true}
            const tokens = await keyTokenModal.findOneAndUpdate({ user: userID }, update, option)
            if (!tokens || tokens === null){
                throw new BadRequestError("Cannot Create Token")
            }
            return tokens 
    }
    
    static findByID = async (userID)=>{
      return await keyTokenModal.findOne({user:Types.ObjectId(userID)}).lean()
    }

    static removeKeyByID = async (id)=>{
      return await keyTokenModal.deleteOne({ _id: id })
    }
}

export default KeyTokenSevice
