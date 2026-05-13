
import Redis from '../dbs/init.redis.js';
import { reversationInventory as reserveInventory } from '../model/repositories/inventory.repo.js';

const redisClient = Redis.getInstance();

const pexpire = async (key, milliseconds) => {
    return redisClient.pExpire(key, milliseconds);
};

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock:product:${productId}`;
    const token = `${cartId}:${Date.now()}`;
    const retryTimes = 10;
    const expireTime = 3000;
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let i = 0; i < retryTimes; i++) {
        const result = await redisClient.set(key, token, { NX: true, PX: expireTime });
        if (result !== 'OK') {
            await sleep(50);
            continue;
        }

        const reservationResult = await reserveInventory({ productId, cartId, quantity });
        if (reservationResult?.modifiedCount) {
            await pexpire(key, expireTime);
            return { success: true, key, token };
        }

        await releaseLock(key, token);
        return { success: false, reason: 'reserve_failed' };
    }

    return { success: false, reason: 'lock_not_acquired' };
};

const releaseLock = async (key, token) => {
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