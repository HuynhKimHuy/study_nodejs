import Shops from "../model/schema.js"

 const findByEmail = async ({email})=>{
     const selection  = { email:1 , password :1 , name : 1, status: 1 , role : 1 }
     return  await Shops.findOne({email}).select(selection).lean()
}

export default findByEmail