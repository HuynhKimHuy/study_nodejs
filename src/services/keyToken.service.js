// Create Token 

import keyTokenModal from "../model/keytoken.model.js";
// hàn nhận vào 2 tham số : userID và publickey
class KeyTokenSevice{
    static createToken = async ({userID, publicKey,privateKey})=>{
        try {
            const publicKeyString = publicKey.toString()
            const newKeyToken = await keyTokenModal.create({
                user:userID,
                publicKey:publicKeyString,
                privateKey:privateKey
            })

            if(!newKeyToken){
                console.log(`Cannot find keyTokenModel`)
                return null
            }
            return newKeyToken.publicKey
        } catch (error) {
            return error
        }
    }
}


export default KeyTokenSevice
