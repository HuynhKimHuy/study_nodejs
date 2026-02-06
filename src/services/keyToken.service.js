// Create Token 

import keyTokenModal from "../model/keytoken.model.js";
import { BadRequestError } from "../core/error.respone.js";
import {Types} from 'mongoose'

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
      return await keyTokenModal.findOne({user: new Types.ObjectId(userID)})
    }

    static removeKeyByID = async (id)=>{
      const objectId = new Types.ObjectId(String(id))
      return await keyTokenModal.deleteOne({ _id: objectId }).lean()
    }

    static findRefreshToken = async (refreshToken)=>{
      return await keyTokenModal.findOne({ refreshToken })
    }

    static findRefreshTokenUsed = async (refreshToken)=>{
      return await keyTokenModal.findOne({refreshTokensUsed:refreshToken})
    }

    static delectKeyByID = async (userId)=>{
      return await keyTokenModal.deleteOne({ user: new Types.ObjectId(String(userId)) })
    }
}

export default KeyTokenSevice
