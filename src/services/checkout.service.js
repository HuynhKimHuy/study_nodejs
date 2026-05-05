
import { findCartById } from '../model/repositories/cart.repo.js'
import { checkProductByServer } from '../model/repositories/product.repo.js'
import DiscountService from './discount.service.js'
import { acquireLock, releaseLock } from './redis.service.js'
import { orderModel } from '../model/order.model.js'
class CheckoutService {
   //login and without checkout
   /*
     { 
       userId:,
       cart_Id:,
       shop_order_ids:[
          {
             shopId:,
             shop_discount:,
             item_product:[
                {
                   productId:,
                   quantity:,
                   old_quantity:
                }
             ]
          },
           {
             shopId:,
             shop_discount:
             {
               shopId:,
               discountId:,
               codeId:
             },
             item_product:[
                {
                   productId:,
                   quantity:,
                   old_quantity:
                }
             ]
          },

       ] 
     }

    */

   static async checkoutReview({ userId, cartId, shop_order_ids }) {
      //check xem giỏ hàng có tồn tại không
      const fondCart = await findCartById({ cartId })
      const checkout_Oder = {
         price: 0, //giá tiền 
         feeShop: 0, //phí vận chuyển
         totalDiscount: 0, //tổng số tiền được giảm
         totalCheckout: 0, //tổng số tiền phải trả sau khi đã trừ đi giảm giá và cộng thêm phí vận chuyển
      }, shop_oderIds_new = []

      //tính tổng tiền bill
      for (let i = 0; i < shop_order_ids.length; i++) {
         const { shopId, shop_discount = {}, item_product = [] } = shop_order_ids[i]
         const checkProductServer = await checkProductByServer(item_product)
         console.log(`checkProduct By Server: `, checkProductServer);

         if (!checkProductServer.length === 0) throw new Error(`check product by server failed: ${checkProductServer}`)

         const totalPrice = checkProductServer.reduce((total, product) => {
            return total + (product.price * product.quantity)
         }, 0)

         checkout_Oder.price += totalPrice

         const itemCheckout = {
            shopId,
            shop_discount,
            priceRaw: totalPrice,
            priceApplyDiscount: totalPrice, //giá tiền sau khi đã áp dụng giảm giá
            item_product: checkProductServer
         }
         const hasDiscount = shop_discount && Object.keys(shop_discount).length > 0
         if (hasDiscount) {
            // giả sử có 1 discount
            //get amount discount 
            const { totalPrice = 0, discount = 0 } = await DiscountService.getAllDiscountAmount({
               codeId: shop_discount.codeId,
               shopId: shop_discount.shopId,
               userId,
               products: checkProductServer

            })
            //tổng giảm giá
            checkout_Oder.totalDiscount += discount

            //nếu tiền giảm giá lớn hơn 0
            if (discount > 0) {
               //cập nhật lại giá tiền sau khi đã áp dụng giảm giá
               itemCheckout.priceApplyDiscount = totalPrice
               checkout_Oder.price -= discount
            }
         }

         checkout_Oder.totalCheckout += itemCheckout.priceApplyDiscount
         shop_oderIds_new.push(itemCheckout)
      }
      return {
         checkout_Oder,
         shop_oderIds_new,
         shop_order_ids
      }
   }
   static async order({
      userId,
      cartId,
      shop_order_ids,
      user_andress = {},
      user_payment = {}
   }) {
      const { checkout_Oder, shop_oderIds_new } = await CheckoutService.checkoutReview({ userId, cartId, shop_order_ids })
      const product = shop_oderIds_new.flatMap(shop => shop.item_product)
      console.log(`[1]`, product);

      const acquiredLocks = [];

      try {
         // 1. Lock tất cả sản phẩm
         for (let i = 0; i < product.length; i++) {
            const { productId, quantity } = product[i];
            const keyLock = await acquireLock(productId, quantity, cartId);

            if (!keyLock.success) {
               throw new Error(`Sản phẩm không đủ tồn kho`);
            }

            acquiredLocks.push(keyLock);
         }

         // 2. Nếu xong thì tạo order
         // ... tạo order ...

         // 3. Order xong mới release
         for (const lock of acquiredLocks) {
            await releaseLock(lock.key, lock.token);
         }

      } catch (err) {
         throw err;  // Nếu lỗi → để lock tự hết hạn 3s
      }
      const order = await orderModel.create({
         order_userId: userId,
         order_checkout: checkout_Oder,
         order_shiping: user_andress,
         order_payment: user_payment,
         order_product: product,
         order_status: 'pending'
      })

      // if insert order success then remove product in cart
      if (order) {
         // ... xóa sản phẩm trong giỏ hàng ...

      }

      return order
   }

   /*
      1> Query Order 
   */
   static async getOrderByUser() {
   }

   /*
      1> Query Order Using Id
   */
   static async getOneOrderByUser() {
   }

   /*
      1> Cancel Order by User
   */
   static async cancelOrderByUser() {

   }

   /*
      1> Query Order by User
   */
   static async updateOrderStatusByShop() {
      
   }



}
export default CheckoutService