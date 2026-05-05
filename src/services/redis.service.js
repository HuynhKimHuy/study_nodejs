
import { createClient } from 'redis';
import { reversationInventory as reserveInventory } from '../model/repositories/inventory.repo.js';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
// Create a Redis client : Cần tạo trước khi thao tác , hầu như tất cả các thao tác với Redis đều cần có client để kết nối và thực hiện các lệnh Redis. Nếu không tạo client trước, bạn sẽ không thể thực hiện bất kỳ thao tác nào với Redis.

const redisClient = createClient({ url: redisUrl });
// Handle Redis connection errors
redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

// Connect to Redis
const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
    return redisClient;
};
// Set a key with an expiration time in milliseconds
const pexpire = async (key, milliseconds) => {
    await connectRedis();
    // Set the expiration time for the key
    return redisClient.pExpire(key, milliseconds);
};

const acquireLock = async (productId, quantity, cartId) => {
    await connectRedis();

    const key = `lock:product:${productId}`;
    const token = `${cartId}:${Date.now()}`;
    const retryTimes = 10;
    const expireTime = 3000;

    for (let i = 0; i < retryTimes; i++) {
        const result = await redisClient.set(key, token, { NX: true, PX: expireTime });

        if (result === 'OK') {
            // Successfully acquired lock, now reserve inventory
            const reservationResult = await reserveInventory({ productId, cartId, quantity });
            if (reservationResult?.modifiedCount) {
                await pexpire(key, expireTime);
                return { success: true, key, token };
            }

            await releaseLock(key, token);
            return { success: false, reason: 'reserve_failed' };
        }


        await new Promise((resolve) => setTimeout(resolve, 50));
    }

    return { success: false, reason: 'lock_not_acquired' };
};

const releaseLock = async (key, token) => {
    await connectRedis();
    const currentToken = await redisClient.get(key);
    if (currentToken === token) {
        return await redisClient.del(key);
    }
    return 0;
};

export {
    acquireLock,
    releaseLock
};