import redisPubSubService from "../services/redisPubSub.service.js";

class ProductServiceTest {
    purschaseProduct = async ({ productId, quantity }) => {
        const order = { productId, quantity };
        await redisPubSubService.publish('purchase_channel', JSON.stringify(order));
        // Simulate product purchase logic here
        console.log(`Purchasing product ${productId} with quantity ${quantity}`);
    }
}
export default new ProductServiceTest()