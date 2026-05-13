
import redisPubSubService from "../services/redisPubSub.service";

class InventServiceTest {
    constructor() {
        redisPubSubService.subscribe('purchase_channel', (message) => {
            const order = JSON.parse(message);
            console.log(`Received purchase order: Product ID ${order.productId}, Quantity ${order.quantity}`);
            // Simulate inventory update logic here
            this.updateInventory(order);
        });
    }
    static async updateInventory({ productId, quantity }) {
        console.log(`Updating inventory for product ${productId} with quantity ${quantity}`);
        // Simulate inventory update logic here
    }
}

export default new InventServiceTest()  