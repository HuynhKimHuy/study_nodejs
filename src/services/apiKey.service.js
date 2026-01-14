
import crypto from 'crypto'
import apiKeyModel from "../model/keyAPI.js"


/*
 - Ý nghĩa : tạo 1 hàm findByID  là 1 hàm bất đồng bộ nhận vào 1 key 
 step 1: tìm trong model() xem có key không bằng findOne , và status là true  

*/
const findByID = async (key) => {
    // const newKeyheader = crypto.randomBytes(64).toString('hex')
    // const newKey  = await apiKeyModel.create({ key:newKeyheader , permissions:['0000']})
    // newKey.save()
    const objKeys = await apiKeyModel.findOne({
      key: key,
      status: true
    }).lean()
    return objKeys
}
export default findByID
