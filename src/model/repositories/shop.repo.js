import mongoose from 'mongoose'

import Shop from '../shop.js'

export const findShopNameById = async (shopId) => {
    const foundShop = await Shop.findOne({ _id: new mongoose.Types.ObjectId(shopId) })
    if (!foundShop) return null
    return foundShop.name
}